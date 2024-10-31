import {
  type Feedback,
  splitStyledText,
  type Step,
  TextInput,
} from "@keybr/textinput";
import { type IInputEvent } from "@keybr/textinput-events";
import { type TextGenerator } from "../generators/index.ts";
import { computeProgress } from "./duration.ts";
import {
  type Progress,
  type SessionLineData,
  type SessionSettings,
} from "./types.ts";

export class Session {
  /** Currently visible lines. */
  #lines!: SessionLineData[];
  /** Index of the edited line. */
  #activeLine!: number;
  /** Text input for the edited line. */
  #textInput!: TextInput;
  /** Steps accumulated from all lines. */
  #steps!: Step[];
  /** Generates unique element keys. */
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

  getLines(): readonly SessionLineData[] {
    return this.#lines;
  }

  getSteps(): readonly Step[] {
    return this.#steps;
  }

  handleInput(event: IInputEvent): [
    feedback: Feedback, //
    progress: Progress,
    completed: boolean,
  ] {
    const feedback = this.#textInput.onInput(event);
    const [progress, completed] = computeProgress(
      this.#steps,
      this.settings.duration,
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
    return [feedback, progress, completed];
  }

  #appendLine(): void {
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

  #setActiveLine(): void {
    const { text } = this.#lines[this.#activeLine];
    this.#textInput = new TextInput(
      text,
      this.settings.textInput,
      (step: Step) => {
        this.#steps.push(step);
      },
    );
    this.#updateActiveLine();
  }

  #updateActiveLine(progress: Progress | null = null): void {
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

  #generateLine(): string {
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
