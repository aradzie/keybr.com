import {
  type AttemptContext,
  type EndReason,
  type OriginalEvent,
  type RecordingRecord,
  type RecordPayload,
  schemaVersion,
} from "@keybr/recording";
import { type Result } from "@keybr/result";
import { type InputChange, type InputState, type Step } from "@keybr/textinput";
import {
  type AnyEvent,
  type InputListener,
  type InputObserver,
} from "@keybr/textinput-events";

type Attempt = { id: string; next: number; ended: boolean; inputTail: boolean };
const releaseOwners = new WeakMap<Event, PracticeRecorder>();
const keyOwners = new Map<string, PracticeRecorder>();

type Cause = {
  attempt: Attempt;
  originalSequence: number;
  original: OriginalEvent;
  processedSequence?: number;
};

export type RecorderOptions = {
  readonly applicationRevision: string;
  readonly board: AttemptContext["board"];
  readonly keymap: AttemptContext["keymap"];
  readonly onRecord: (record: RecordingRecord) => void;
  readonly onError?: (error: unknown) => void;
};

/** An optional observer. Retention and transport belong to the caller. */
export class PracticeRecorder implements InputObserver {
  readonly #options: RecorderOptions;
  readonly #uuid: () => string;
  readonly #now: () => number;
  readonly #timeOrigin: number;
  readonly #releaseTarget?: Pick<
    Window,
    "addEventListener" | "removeEventListener"
  >;
  readonly #presses = new Map<string, { attempt: Attempt; sequence: number }>();
  readonly #seen = new WeakMap<Event, Cause>();
  #getContext: (() => AttemptContext) | null = null;
  #active: Attempt | null = null;
  #cause: Cause | null = null;
  #listening = false;
  #lastPress: { attempt: Attempt; sequence: number; code: string } | null =
    null;

  constructor(
    options: RecorderOptions,
    {
      uuid = () => crypto.randomUUID(),
      now = () => performance.now(),
      timeOrigin = performance.timeOrigin,
      releaseTarget = window,
    }: {
      uuid?: () => string;
      now?: () => number;
      timeOrigin?: number;
      releaseTarget?: Pick<Window, "addEventListener" | "removeEventListener">;
    } = {},
  ) {
    this.#options = options;
    this.#uuid = uuid;
    this.#now = now;
    this.#timeOrigin = timeOrigin;
    this.#releaseTarget = releaseTarget;
  }

  /** Called for a new exercise, after the previous attempt has been ended. */
  prepare(getContext: () => AttemptContext) {
    this.#getContext = getContext;
  }

  onEvent = (event: KeyboardEvent | InputEvent | CompositionEvent) => {
    const previous = this.#cause;
    this.#cause =
      releaseOwners.has(event) && releaseOwners.get(event) !== this
        ? null
        : (this.#seen.get(event) ?? this.#original(event));
    return () => {
      this.#cause = previous;
    };
  };

  observe(target: InputListener): InputListener {
    return {
      onKeyDown: (event) =>
        this.#processed(event, () => target.onKeyDown(event)),
      onKeyUp: (event) => this.#processed(event, () => target.onKeyUp(event)),
      onInput: (event) => this.#processed(event, () => target.onInput(event)),
    };
  }

  onState = (change: InputChange) => {
    const cause = this.#cause;
    if (cause?.processedSequence == null || cause.attempt.ended) return;
    this.#emit(cause.attempt, {
      type: "state",
      processedSequence: cause.processedSequence,
      effect: change.effect,
      feedback: change.feedback,
      before: copyState(change.before),
      after: copyState(change.after),
      accepted: splice(change.before.steps, change.after.steps),
      pending: splice(change.before.pending, change.after.pending),
    });
  };

  end(reason: EndReason, result?: Result) {
    const attempt = this.#active;
    if (attempt == null || attempt.ended) return;
    attempt.inputTail =
      reason === "completed" && this.#cause?.original.type === "keydown";
    attempt.ended = true;
    this.#active = null;
    this.#emit(attempt, {
      type: "end",
      reason,
      result:
        result == null
          ? null
          : {
              ...result.toJSON(),
              timeStamp: new Date(result.timeStamp).toISOString(),
            },
      resultAccepted: result == null ? null : result.validate(),
    });
  }

  /** Keep only matching outstanding releases observable after leaving practice. */
  leave(reason: EndReason = "navigation") {
    this.end(reason);
    this.#getContext = null;
  }

  #original(
    event: KeyboardEvent | InputEvent | CompositionEvent,
  ): Cause | null {
    const original = snapshotEvent(event, this.#timeOrigin);
    const code = original.code;
    const press = code ? this.#presses.get(code) : null;
    if (this.#getContext == null && !(original.type === "keyup" && press))
      return null;
    const tail =
      this.#lastPress != null &&
      this.#presses.get(this.#lastPress.code)?.sequence ===
        this.#lastPress.sequence
        ? this.#lastPress
        : null;
    const owner =
      original.type === "keyup" || original.repeat
        ? press
        : original.type === "input" && tail?.attempt.inputTail
          ? tail
          : null;
    let attempt = owner?.attempt ?? this.#active;
    if (attempt == null) {
      if (original.type === "keyup" || this.#getContext == null) return null;
      attempt = { id: this.#uuid(), next: 0, ended: false, inputTail: false };
      this.#active = attempt;
      this.#emit(attempt, {
        type: "start",
        context: clone(this.#getContext()),
      });
    }
    const sequence = this.#emit(attempt, {
      type: "original",
      event: original,
      pressSequence:
        original.type === "keyup" ||
        original.repeat ||
        (attempt.ended && original.type === "input")
          ? (owner?.sequence ?? null)
          : null,
    });
    if (original.type === "keydown" && code && !original.repeat) {
      const previousOwner = keyOwners.get(code);
      if (previousOwner != null) previousOwner.#forgetPress(code);
      keyOwners.set(code, this);
      this.#presses.set(code, { attempt, sequence });
      this.#lastPress = { attempt, sequence, code };
      this.#listen();
    }
    if (original.type === "keyup" && code && press) {
      releaseOwners.set(event, this);
      this.#forgetPress(code);
    }
    const cause = { attempt, originalSequence: sequence, original };
    this.#seen.set(event, cause);
    return cause;
  }

  #processed(event: AnyEvent, dispatch: () => void) {
    const cause = this.#cause;
    if (cause == null || (cause.attempt.ended && event.type !== "keyup")) {
      dispatch();
      return;
    }
    const previous = cause.processedSequence;
    cause.processedSequence = this.#emit(cause.attempt, {
      type: "processed",
      originalSequence: cause.originalSequence,
      // Forward emulation produces input from a keydown, never another press.
      synthetic: event.type === "input" && cause.original.type === "keydown",
      event:
        event.type === "input"
          ? { ...event }
          : { ...event, modifiers: [...event.modifiers] },
    });
    try {
      dispatch();
    } finally {
      cause.processedSequence = previous;
    }
  }

  #emit(attempt: Attempt, payload: RecordPayload): number {
    const sequence = attempt.next++;
    const record = {
      ...payload,
      schemaVersion,
      attemptId: attempt.id,
      sequence,
      observedAt: this.#now(),
    } as RecordingRecord;
    try {
      this.#options.onRecord(record);
    } catch (error) {
      try {
        this.#options.onError?.(error);
      } catch {
        /* Never interrupt typing. */
      }
    }
    return sequence;
  }

  #forgetPress(code: string) {
    this.#presses.delete(code);
    if (keyOwners.get(code) === this) keyOwners.delete(code);
    if (this.#presses.size === 0) this.#unlisten();
  }

  #handleRelease = (event: Event) => {
    const keyboardEvent = event as KeyboardEvent;
    if (this.#presses.has(keyboardEvent.code) && !this.#seen.has(event)) {
      this.#original(keyboardEvent);
    }
  };

  #listen() {
    if (!this.#listening) {
      this.#releaseTarget?.addEventListener("keyup", this.#handleRelease, true);
      this.#listening = true;
    }
  }

  #unlisten() {
    this.#releaseTarget?.removeEventListener(
      "keyup",
      this.#handleRelease,
      true,
    );
    this.#listening = false;
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function copyState(state: InputState) {
  return {
    ...state,
    steps: state.steps.map((s) => ({ ...s })),
    pending: state.pending.map((s) => ({ ...s })),
  };
}

function splice(before: readonly Step[], after: readonly Step[]) {
  let from = 0;
  while (
    from < before.length &&
    from < after.length &&
    JSON.stringify(before[from]) === JSON.stringify(after[from])
  )
    from++;
  return {
    from,
    removed: before.slice(from).map((s) => ({ ...s })),
    inserted: after.slice(from).map((s) => ({ ...s })),
  };
}

export function snapshotEvent(
  event: KeyboardEvent | InputEvent | CompositionEvent,
  timeOrigin: number,
): OriginalEvent {
  const keyboard = "code" in event ? event : null;
  const modifiers: Record<string, boolean> = {};
  if (keyboard) {
    for (const id of [
      "Alt",
      "AltGraph",
      "CapsLock",
      "Control",
      "Fn",
      "FnLock",
      "Hyper",
      "Meta",
      "NumLock",
      "ScrollLock",
      "Shift",
      "Super",
      "Symbol",
      "SymbolLock",
    ])
      modifiers[id] = keyboard.getModifierState(id);
    modifiers.altKey = keyboard.altKey;
    modifiers.ctrlKey = keyboard.ctrlKey;
    modifiers.metaKey = keyboard.metaKey;
    modifiers.shiftKey = keyboard.shiftKey;
  }
  return {
    type: event.type as OriginalEvent["type"],
    timeStamp: event.timeStamp,
    timeOrigin,
    isTrusted: event.isTrusted ?? null,
    key: keyboard?.key ?? null,
    code: keyboard?.code ?? null,
    location: keyboard?.location ?? null,
    repeat: keyboard?.repeat ?? null,
    modifiers,
    inputType: "inputType" in event ? event.inputType : null,
    data: "data" in event ? event.data : null,
    isComposing: "isComposing" in event ? event.isComposing : null,
  };
}
