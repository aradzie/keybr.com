import {
  type Feedback,
  splitStyledText,
  type Step,
  TextInput,
} from "@keybr/textinput";
import {
  type AnyEvent,
  type IInputEvent,
  type IKeyboardEvent,
} from "@keybr/textinput-events";
import { type TextGenerator } from "../generators/index.ts";
import { computeProgress } from "./duration.ts";
import {
  type Progress,
  type SessionLine,
  type SessionLines,
  type SessionSettings,
} from "./types.ts";

export class Session {
  static readonly emptyLines = {
    text: "",
    lines: [],
  } satisfies SessionLines;
  static readonly emptyProgress = {
    time: 0,
    length: 0,
    progress: 0,
    speed: 0,
  } satisfies Progress;

  /** A list of events to replay. */
  #events: AnyEvent[] = [];
  /** The currently visible lines. */
  #lines!: SessionLine[];
  /** The index of the edited line. */
  #activeLine!: number;
  /** The text input for the edited line. */
  #textInput!: TextInput;
  /** The steps accumulated from all lines. */
  #steps!: Step[];
  /** Generates unique React element keys. */
  #index = 0;

  constructor(
    readonly settings: SessionSettings,
    readonly generator: TextGenerator,
  ) {
    this.#lines = [];
    this.#activeLine = 0;
    this.#steps = [];
    while (this.#lines.length < this.settings.numLines) {
      this.#appendLine();
    }
    this.#setActiveLine();
  }

  getEvents(): readonly AnyEvent[] {
    return this.#events;
  }

  getLines(): SessionLines {
    return { text: "", lines: this.#lines };
  }

  getSteps(): readonly Step[] {
    return this.#steps;
  }

  handleKeyDown = (event: IKeyboardEvent) => {
    this.#addEvent(event);
  };

  handleKeyUp = (event: IKeyboardEvent) => {
    this.#addEvent(event);
  };

  handleInput = (
    event: IInputEvent,
  ): {
    feedback: Feedback;
    progress: Progress;
    completed: boolean;
  } => {
    this.#addEvent(event);
    const feedback = this.#textInput.onInput(event);
    const { progress, completed } = computeProgress(
      this.settings.duration,
      this.#steps,
    );
    this.#updateActiveLine(progress);
    if (this.#textInput.completed) {
      if (this.#activeLine < this.#lines.length - 3) {
        this.#activeLine += 1;
      } else {
        this.#lines.shift();
        this.#appendLine();
      }
      this.#setActiveLine();
    }
    return { feedback, progress, completed };
  };

  #addEvent(event: AnyEvent) {
    this.#events.push(event);
  }

  #appendLine() {
    const mark = this.generator.mark();
    const text = this.#generateLine();
    const chars = splitStyledText(text);
    const index = (this.#index += 1);
    this.#lines.push({
      mark,
      index,
      text,
      chars,
      progress: null,
    });
  }

  #setActiveLine() {
    const { text } = this.#lines[this.#activeLine];
    this.#textInput = new TextInput(text, this.settings.textInput, (step) => {
      this.#steps.push(step);
    });
    this.#updateActiveLine();
  }

  #updateActiveLine(progress: Progress | null = null) {
    const { mark, index, text } = this.#lines[this.#activeLine];
    const { chars } = this.#textInput;
    this.#lines[this.#activeLine] = {
      mark,
      index,
      text,
      chars,
      progress,
    };
  }

  #generateLine() {
    const {
      settings: { numCols },
      generator,
    } = this;
    let line = "";
    while (true) {
      const mark = generator.mark();
      const word = generator.nextWord();
      if (line.length > 0 && line.length + word.length + 1 > numCols) {
        generator.reset(mark);
        break;
      }
      line += `${word} `;
    }
    return line;
  }
}
