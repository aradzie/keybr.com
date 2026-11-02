import { z } from "zod";

export const schemaVersion = 1;
const position = z.number().int().nonnegative();
const time = z.number();
const codePoint = z.number().int().min(0).max(0x10ffff);
const versionReference = z.strictObject({
  id: z.string().min(1),
  version: z.string().min(1),
});
const settings = z.record(z.string(), z.json());

export const attemptContextSchema = z.strictObject({
  text: z.string(),
  applicationRevision: z.string().min(1),
  board: versionReference.nullable(),
  keymap: versionReference.nullable(),
  settings: z.strictObject({
    typing: settings,
    exercise: settings,
    layout: settings,
  }),
});
export type AttemptContext = z.infer<typeof attemptContextSchema>;

export const stepSchema = z.strictObject({
  timeStamp: time,
  codePoint,
  timeToType: time,
  typo: z.boolean(),
});
export const inputStateSchema = z
  .strictObject({
    cursor: position,
    steps: z.array(stepSchema),
    pending: z.array(stepSchema),
    typo: z.boolean(),
    completed: z.boolean(),
  })
  .refine(
    (state) => state.cursor === state.steps.length,
    "Cursor must count accepted code points",
  );

export const originalEventSchema = z.strictObject({
  type: z.enum([
    "keydown",
    "keyup",
    "input",
    "compositionstart",
    "compositionupdate",
    "compositionend",
  ]),
  timeStamp: time,
  timeOrigin: time,
  isTrusted: z.boolean().nullable(),
  key: z.string().nullable(),
  code: z.string().nullable(),
  location: position.nullable(),
  modifiers: z.record(z.string(), z.boolean()),
  repeat: z.boolean().nullable(),
  inputType: z.string().nullable(),
  data: z.string().nullable(),
  isComposing: z.boolean().nullable(),
});
export type OriginalEvent = z.infer<typeof originalEventSchema>;
const keyboardEvent = z.strictObject({
  type: z.enum(["keydown", "keyup"]),
  timeStamp: time,
  code: z.string(),
  key: z.string(),
  modifiers: z.array(z.string()),
});
const inputEvent = z.strictObject({
  type: z.literal("input"),
  timeStamp: time,
  inputType: z.enum([
    "appendChar",
    "appendLineBreak",
    "clearChar",
    "clearWord",
  ]),
  codePoint,
  timeToType: time,
});
const nativeResult = z.strictObject({
  layout: z.string(),
  textType: z.string(),
  timeStamp: z.iso.datetime(),
  length: position,
  time,
  errors: position,
  speed: time,
  histogram: z.array(
    z.strictObject({
      codePoint,
      hitCount: position,
      missCount: position,
      timeToType: time,
    }),
  ),
});
export const endReasonSchema = z.enum([
  "completed",
  "reset",
  "skipped",
  "inactivity",
  "focus-loss",
  "settings-change",
  "keyboard-change",
  "navigation",
]);
export type EndReason = z.infer<typeof endReasonSchema>;

const base = {
  schemaVersion: z.literal(schemaVersion),
  attemptId: z.uuid(),
  sequence: position,
  // Observation time is separate from event and recovered-step timestamps.
  observedAt: time,
};
export const recordSchema = z.discriminatedUnion("type", [
  z.strictObject({
    ...base,
    type: z.literal("start"),
    context: attemptContextSchema,
  }),
  z.strictObject({
    ...base,
    type: z.literal("original"),
    event: originalEventSchema,
    pressSequence: position.nullable(),
  }),
  z.strictObject({
    ...base,
    type: z.literal("processed"),
    originalSequence: position,
    synthetic: z.boolean(),
    event: z.union([keyboardEvent, inputEvent]),
  }),
  z.strictObject({
    ...base,
    type: z.literal("state"),
    processedSequence: position,
    effect: z.enum([
      "accepted",
      "rejected",
      "ignored-space",
      "delete-character",
      "delete-word",
      "skip-word",
      "forgiven",
      "replace-character",
      "skip-character",
    ]),
    feedback: z.union([z.literal(0), z.literal(1), z.literal(2)]),
    before: inputStateSchema,
    after: inputStateSchema,
    accepted: z.strictObject({
      from: position,
      removed: z.array(stepSchema),
      inserted: z.array(stepSchema),
    }),
    pending: z.strictObject({
      from: position,
      removed: z.array(stepSchema),
      inserted: z.array(stepSchema),
    }),
  }),
  z
    .strictObject({
      ...base,
      type: z.literal("end"),
      reason: endReasonSchema,
      result: nativeResult.nullable(),
      resultAccepted: z.boolean().nullable(),
    })
    .refine(
      (r) =>
        r.reason === "completed"
          ? r.result != null && r.resultAccepted != null
          : r.result == null && r.resultAccepted == null,
      "Only completed attempts have a native result and validation outcome",
    ),
]);
export type RecordingRecord = z.infer<typeof recordSchema>;
export type RecordPayload = RecordingRecord extends infer R
  ? R extends RecordingRecord
    ? Omit<R, keyof typeof base>
    : never
  : never;

/** Validate one complete attempt, including late releases. Batches may use recordSchema. */
export function parseAttempt(value: unknown): RecordingRecord[] {
  const records = z.array(recordSchema).min(2).parse(value);
  const start = records[0];
  if (start.type !== "start" || start.sequence !== 0)
    throw new TypeError("Missing attempt start");
  const previous = new Map<number, RecordingRecord>();
  const presses = new Map<string, number>();
  let ended = false;
  let lastState: z.infer<typeof inputStateSchema> | null = null;
  const length = [...start.context.text].length;
  for (const [index, record] of records.entries()) {
    if (record.attemptId !== start.attemptId || record.sequence !== index)
      throw new TypeError("Invalid record identity/order");
    if (index > 0 && record.type === "start")
      throw new TypeError("Duplicate start");
    if (record.type === "original") {
      const { type, code, repeat } = record.event;
      if (
        ended &&
        type !== "keyup" &&
        !(type === "keydown" && repeat) &&
        type !== "input"
      )
        throw new TypeError("Invalid event after end");
      if (record.pressSequence != null) {
        const press = previous.get(record.pressSequence);
        if (
          press?.type !== "original" ||
          press.event.type !== "keydown" ||
          presses.get(press.event.code!) !== press.sequence ||
          (type !== "input" && press.event.code !== code)
        )
          throw new TypeError("Invalid press ownership");
        if (type === "keyup") presses.delete(code!);
      } else if (ended) throw new TypeError("Unmatched event after end");
      if (type === "keydown" && code && !repeat)
        presses.set(code, record.sequence);
    }
    if (record.type === "processed") {
      const cause = previous.get(record.originalSequence);
      if (
        cause?.type !== "original" ||
        (ended &&
          (cause.event.type !== "keyup" || record.event.type !== "keyup"))
      )
        throw new TypeError("Invalid original event link");
      if (record.event.type === "input") {
        if (
          !["input", "compositionend", "keydown"].includes(cause.event.type) ||
          record.synthetic !== (cause.event.type === "keydown")
        )
          throw new TypeError("Invalid synthetic input link");
      } else if (record.synthetic || record.event.type !== cause.event.type)
        throw new TypeError("Invalid keyboard event link");
    }
    if (record.type === "state") {
      const cause = previous.get(record.processedSequence);
      if (ended || cause?.type !== "processed" || cause.event.type !== "input")
        throw new TypeError("Invalid processed input link");
      for (const [name, change] of [
        ["steps", record.accepted],
        ["pending", record.pending],
      ] as const) {
        const before = record.before[name];
        if (
          change.from > before.length ||
          JSON.stringify(before.slice(change.from)) !==
            JSON.stringify(change.removed) ||
          JSON.stringify([
            ...before.slice(0, change.from),
            ...change.inserted,
          ]) !== JSON.stringify(record.after[name])
        )
          throw new TypeError("Invalid state splice");
      }
      if (
        lastState != null &&
        JSON.stringify(record.before) !== JSON.stringify(lastState)
      )
        throw new TypeError("Discontinuous engine state");
      for (const state of [record.before, record.after]) {
        if (
          state.cursor > length ||
          state.completed !== (state.cursor === length)
        )
          throw new TypeError("Invalid cursor/completion state");
      }
      lastState = record.after;
    }
    if (record.type === "end") {
      if (ended) throw new TypeError("Duplicate end");
      if (record.reason === "completed" && !lastState?.completed)
        throw new TypeError("Missing completed state");
      ended = true;
    }
    previous.set(record.sequence, record);
  }
  if (!ended) throw new TypeError("Missing attempt end");
  return records;
}
