import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  parseAttempt,
  type RecordingRecord,
  recordSchema,
} from "@keybr/recording";
import { Feedback, TextInput } from "@keybr/textinput";
import { InputHandler } from "@keybr/textinput-events/lib/inputhandler.ts";
import { fakeEvent } from "@keybr/textinput-events/lib/testing.ts";
import { PracticeRecorder } from "./recorder.ts";
import { replayScenario, type Scenario } from "./testing.ts";

const fixtures = JSON.parse(
  await readFile(
    new URL("../../keybr-recording/fixtures/v1.json", import.meta.url),
    "utf8",
  ),
) as {
  scenarios: (Scenario & { expected: ReturnType<typeof replayScenario> })[];
};
for (const fixture of fixtures.scenarios) {
  test(`reference fixture: ${fixture.name}`, () => {
    const actual = replayScenario(fixture);
    assert.deepEqual(actual, fixture.expected);
    const disabled = replayScenario(fixture, false);
    assert.deepEqual(
      { ...actual, records: [] },
      disabled,
      "Native outcomes must be identical without recording",
    );
    for (const records of Object.values(
      Object.groupBy(actual.records as RecordingRecord[], (r) => r.attemptId),
    )) {
      parseAttempt(records);
    }
  });
}

function recorded(name: string): RecordingRecord[] {
  return fixtures.scenarios.find((f) => f.name === name)!.expected.records;
}

test("recovery records earlier event times at a later sequence and explicit skipped steps", () => {
  for (const name of [
    "replaced-character-recovery",
    "skipped-character-recovery",
  ]) {
    const records = recorded(name);
    const recovery = records.find(
      (r) =>
        r.type === "state" &&
        ["replace-character", "skip-character"].includes(r.effect),
    );
    assert.ok(recovery?.type === "state");
    assert.equal(recovery.before.cursor, 0);
    assert.equal(recovery.after.cursor, 4);
    assert.equal(recovery.accepted.inserted[0].typo, true);
    assert.equal(recovery.accepted.inserted[0].timeToType, 0);
    assert.ok(
      recovery.accepted.inserted[0].timeStamp <
        recovery.accepted.inserted.at(-1)!.timeStamp,
    );
    assert.equal(recovery.pending.inserted.length, 0);
    assert.equal(recovery.feedback, Feedback.Recovered);
  }
});

test("deletion, wrong-character accumulation, and Unicode positions are explicit", () => {
  const wrong = recorded("multiple-wrong-and-backspace").filter(
    (r) => r.type === "state",
  );
  assert.deepEqual(
    wrong.slice(0, 4).map((r) => r.after.pending.length),
    [1, 2, 1, 0],
  );
  assert.deepEqual(
    wrong.slice(2, 4).map((r) => r.effect),
    ["delete-character", "delete-character"],
  );
  const word = recorded("clear-word").find(
    (r) => r.type === "state" && r.effect === "delete-word",
  );
  assert.ok(word?.type === "state");
  assert.equal(word.accepted.removed.length, 2);
  assert.equal(word.after.cursor, 0);
  const unicode = recorded("unicode").filter((r) => r.type === "state");
  assert.deepEqual(
    unicode.map((r) => r.after.cursor),
    [1, 2],
  );
});

test("emulated input is synthetic and repeats remain original only", () => {
  for (const mode of ["forward", "reverse"]) {
    const records = recorded(`${mode}-emulation-and-repeat`);
    const processed = records.filter((r) => r.type === "processed");
    const original = records.filter((r) => r.type === "original");
    const repeat = original.find((r) => r.event.repeat);
    assert.ok(repeat);
    assert.ok(
      !processed.some(
        (r) =>
          r.originalSequence === repeat.sequence &&
          r.attemptId === repeat.attemptId,
      ),
    );
    const input = processed.find((r) => r.event.type === "input");
    assert.equal(input?.synthetic, mode === "forward");
    const down = processed.find((r) => r.event.type === "keydown");
    assert.ok(down?.event.type === "keydown");
    assert.equal(down.event.key, "o");
    assert.equal(down.event.code, "KeyS");
  }
});

test("completion retains rejected results and final releases", () => {
  const records = recorded("held-key-crossing-exercises");
  const ends = records.filter((r) => r.type === "end");
  assert.equal(ends.length, 2);
  for (const end of ends) {
    assert.equal(end.reason, "completed");
    assert.equal(end.resultAccepted, false);
    const release = records.find(
      (r) =>
        r.type === "original" &&
        r.event.type === "keyup" &&
        r.attemptId === end.attemptId,
    );
    assert.ok(release);
    assert.ok(release.sequence > end.sequence);
  }
  const ordinary = recorded("ordinary").find((r) => r.type === "end");
  assert.ok(ordinary?.type === "end");
  assert.equal(ordinary.resultAccepted, true);
});

test("outside practice only the outstanding release is captured", () => {
  const records = recorded("release-after-navigation");
  assert.deepEqual(
    records.filter((r) => r.type === "original").map((r) => r.event.code),
    ["KeyA", "KeyA"],
  );
  assert.equal(records.at(-1)?.type, "original");
  assert.equal(recorded("empty-focus-resets").length, 0);
});

test("snapshot reads are detached and throwing observers cannot affect typing", () => {
  const input = new TextInput(
    "ab",
    { stopOnError: false, forgiveErrors: false, spaceSkipsWords: false },
    undefined,
    () => {
      throw new Error("broken observer");
    },
  );
  assert.equal(input.appendChar(100, 97, 100), Feedback.Succeeded);
  const snapshot = input.snapshot();
  (snapshot.steps[0] as { typo: boolean }).typo = true;
  (snapshot.steps as unknown[]).pop();
  assert.equal(input.snapshot().steps.length, 1);
  assert.equal(input.snapshot().steps[0].typo, false);
  assert.equal(input.appendChar(200, 98, 100), Feedback.Succeeded);
  assert.equal(input.completed, true);
});

test("sink errors and raw observer errors leave input delivery intact", () => {
  const handler = new InputHandler();
  let inputs = 0;
  handler.setCallbacks({
    inputObserver: {
      onEvent() {
        throw new Error("observer");
      },
    },
    onInput: () => inputs++,
  });
  handler.handleInput(
    fakeEvent({
      type: "input",
      timeStamp: 100,
      inputType: "insertText",
      data: "a",
    }),
  );
  assert.equal(inputs, 1);
  const recorder = new PracticeRecorder({
    applicationRevision: "test",
    board: null,
    keymap: null,
    onRecord() {
      throw new Error("sink");
    },
  });
  const context = recorded("ordinary")[0];
  assert.ok(context.type === "start");
  recorder.prepare(() => context.context);
  handler.setCallbacks({
    inputObserver: recorder,
    ...recorder.observe({
      onKeyDown() {},
      onKeyUp() {},
      onInput: () => inputs++,
    }),
  });
  handler.handleInput(
    fakeEvent({
      type: "input",
      timeStamp: 200,
      inputType: "insertText",
      data: "a",
    }),
  );
  recorder.leave();
  assert.equal(inputs, 2);
});

test("releases keep their owner across practice remounts and superseded presses stay missing", () => {
  const records: RecordingRecord[] = [];
  const start = recorded("ordinary")[0];
  assert.ok(start.type === "start");
  const make = () => {
    const recorder = new PracticeRecorder({
      applicationRevision: "test",
      board: null,
      keymap: null,
      onRecord: (record) => records.push(record),
    });
    recorder.prepare(() => start.context);
    const handler = new InputHandler();
    handler.setCallbacks({ inputObserver: recorder });
    return { recorder, handler };
  };
  const old = make();
  old.handler.handleKeyboard(
    fakeEvent({ type: "keydown", code: "KeyQ", key: "q", timeStamp: 100 }),
  );
  old.recorder.leave();
  const next = make();
  next.handler.handleKeyboard(
    fakeEvent({ type: "keydown", code: "KeyW", key: "w", timeStamp: 200 }),
  );
  const oldRelease = new KeyboardEvent("keyup", { code: "KeyQ", key: "q" });
  window.dispatchEvent(oldRelease);
  next.handler.handleKeyboard(oldRelease);
  assert.equal(
    records.filter((r) => r.type === "original" && r.event.type === "keyup")
      .length,
    1,
  );
  assert.equal(records.at(-1)?.attemptId, records[0].attemptId);
  // The missing release for the first W must not steal the next W's release.
  next.handler.handleKeyboard(
    fakeEvent({ type: "keydown", code: "KeyW", key: "w", timeStamp: 300 }),
  );
  next.recorder.leave();
  window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyW", key: "w" }));
  const last = records.at(-1);
  assert.ok(last?.type === "original");
  assert.equal(
    last.pressSequence,
    records.findLast(
      (r) => r.type === "original" && r.event.type === "keydown",
    )!.sequence,
  );
  for (const attempt of Object.values(
    Object.groupBy(records, (r) => r.attemptId),
  ))
    parseAttempt(attempt);
});
