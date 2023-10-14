import { type Feedback, type Step, TextInput, toChars } from "@keybr/textinput";
import { type TextGenerator } from "../generator/index.ts";
import { computeProgress } from "./duration.ts";
import {
  type Progress,
  type SessionLineData,
  type SessionSettings,
} from "./types.ts";

export class Session {
  /** Currently visible lines. */
  private _lines!: SessionLineData[];
  /** Index of the edited line. */
  private _activeLine!: number;
  /** Text input for the edited line. */
  private _textInput!: TextInput;
  /** Steps accumulated from all lines. */
  private _steps!: Step[];
  /** Generates unique element keys. */
  private _index = 0;

  constructor(
    readonly settings: SessionSettings,
    readonly generator: TextGenerator,
  ) {
    this._lines = [];
    this._activeLine = 0;
    this._steps = [];
    while (this._lines.length < this.settings.numLines) {
      this._appendLine();
    }
    this._setActiveLine();
  }

  getLines(): readonly SessionLineData[] {
    return this._lines;
  }

  getSteps(): readonly Step[] {
    return this._steps;
  }

  handleInput(
    codePoint: number,
    timeStamp: number,
  ): [
    feedback: Feedback, //
    progress: Progress,
    completed: boolean,
  ] {
    const feedback = this._textInput.step(codePoint, timeStamp);
    const [progress, completed] = computeProgress(
      this._steps,
      this.settings.duration,
    );
    this._updateActiveLine(progress);
    if (this._textInput.completed) {
      if (this._activeLine < this._lines.length - 3) {
        this._activeLine += 1;
      } else {
        this._lines.shift();
        this._appendLine();
      }
      this._setActiveLine();
    }
    return [feedback, progress, completed];
  }

  private _appendLine(): void {
    const mark = this.generator.mark();
    const text = this._generateLine();
    const chars = toChars(text);
    const index = (this._index += 1);
    this._lines.push({
      mark,
      index,
      text,
      chars,
      progress: null,
    });
  }

  private _setActiveLine(): void {
    const { text } = this._lines[this._activeLine];
    this._textInput = new TextInput(
      text,
      this.settings.textInput,
      (step: Step) => {
        this._steps.push(step);
      },
    );
    this._updateActiveLine();
  }

  private _updateActiveLine(progress: Progress | null = null): void {
    const { mark, index, text } = this._lines[this._activeLine];
    const chars = this._textInput.getChars();
    this._lines[this._activeLine] = {
      mark,
      index,
      text,
      chars,
      progress,
    };
  }

  private _generateLine(): string {
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
