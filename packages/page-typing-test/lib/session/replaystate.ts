import { type KeyId } from "@keybr/keyboard";
import { Timer } from "@keybr/lang";
import {
  computeSpeed,
  type Step,
  TextInput,
  type TextInputSettings,
} from "@keybr/textinput";
import { addKey, type AnyEvent, deleteKey } from "@keybr/textinput-events";
import { type Progress } from "./types.ts";

export type State = "starting" | "running" | "finished";

export class ReplayState {
  readonly #settings: TextInputSettings;
  readonly #lines: readonly string[];
  readonly #events: readonly AnyEvent[];
  readonly #progress: ReplayProgress;
  #state!: State;
  #timer!: Timer;
  #lineIndex!: number;
  #eventIndex!: number;
  #textInput!: TextInput;
  #depressedKeys!: KeyId[];

  constructor(
    settings: TextInputSettings,
    steps: readonly Step[],
    events: readonly AnyEvent[],
  ) {
    this.#settings = settings;
    this.#lines = splitLines(steps);
    this.#events = shiftTimeStamps(events);
    this.#progress = new ReplayProgress(steps);
    this.reset("starting");
  }

  reset(state: State = "starting") {
    this.#progress.reset();
    this.#state = state;
    this.#timer = new Timer();
    this.#lineIndex = 0;
    this.#eventIndex = 0;
    this.#textInput = this.#makeTextInput();
    this.#depressedKeys = [];
  }

  get progress() {
    return this.#progress;
  }

  get state() {
    return this.#state;
  }

  get delay() {
    switch (this.#state) {
      case "starting":
        return 3000;
      case "finished":
        return 3000;
    }
    const event = this.#events[this.#eventIndex];
    return Math.max(0, event.timeStamp - this.#timer.elapsed);
  }

  step() {
    switch (this.#state) {
      case "starting":
        this.reset("running");
        return;
      case "finished":
        this.reset("starting");
        return;
    }
    const event = this.#events[this.#eventIndex];
    switch (event.type) {
      case "input":
        this.#textInput.onInput(event);
        if (this.#textInput.completed) {
          this.#lineIndex += 1;
          if (this.#lineIndex < this.#lines.length) {
            this.#textInput = this.#makeTextInput();
          }
        }
        break;
      case "keydown":
        this.#depressedKeys = addKey(this.#depressedKeys, event.code);
        break;
      case "keyup":
        this.#depressedKeys = deleteKey(this.#depressedKeys, event.code);
        break;
    }
    this.#eventIndex += 1;
    if (this.#events.length === this.#eventIndex) {
      this.#state = "finished";
    }
  }

  get chars() {
    return this.#textInput.chars;
  }

  get lines() {
    return this.#textInput.lines;
  }

  get depressedKeys() {
    return this.#depressedKeys;
  }

  #makeTextInput() {
    return new TextInput(this.#lines[this.#lineIndex], this.#settings, () => {
      this.#progress.bump();
    });
  }
}

export class ReplayProgress implements Progress {
  readonly #steps: readonly Step[];
  #index!: number;
  #elapsed!: number;
  #timer!: Timer;
  #last!: number;
  #speed!: number;

  constructor(steps: readonly Step[]) {
    this.#steps = [...steps];
    this.reset();
  }

  reset() {
    this.#index = 0;
    this.#elapsed = 0;
    this.#timer = new Timer();
    this.#last = 0;
    this.#speed = 0;
  }

  get time() {
    if (this.#index === this.#steps.length) {
      return (this.#last = this.#elapsed);
    } else {
      return (this.#last = Math.max(
        this.#last,
        this.#elapsed + this.#timer.elapsed,
      ));
    }
  }

  get length() {
    return this.#steps.length;
  }

  get progress() {
    return this.#index;
  }

  get speed() {
    return this.#speed;
  }

  bump() {
    const head = this.#steps[0];
    const curr = this.#steps[this.#index];
    this.#index += 1;
    this.#elapsed = curr.timeStamp - head.timeStamp;
    this.#timer = new Timer();
    this.#speed = computeSpeed(this.#index, this.#elapsed);
  }
}

function shiftTimeStamps(events: readonly AnyEvent[]) {
  const result: AnyEvent[] = [];
  let timeStamp = 0;
  for (const event of events) {
    if (result.length === 0) {
      timeStamp = event.timeStamp;
    }
    result.push({ ...event, timeStamp: event.timeStamp - timeStamp });
  }
  return result;
}

function splitLines(steps: readonly Step[], limit: number = 50) {
  const lines: string[] = [];
  let line = "";
  let ws = false;
  for (let i = 0; i < steps.length; i++) {
    const { codePoint } = steps[i];
    if (codePoint === 0x0020) {
      line += String.fromCodePoint(codePoint);
      ws = true;
    } else {
      if (ws) {
        if (line.length >= limit) {
          lines.push(line);
          line = "";
        }
      }
      line += String.fromCodePoint(codePoint);
      ws = false;
    }
  }
  if (line.length > 0) {
    lines.push(line);
  }
  return lines;
}
