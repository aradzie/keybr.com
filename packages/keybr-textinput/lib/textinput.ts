import { filterText } from "@keybr/keyboard";
import { type CodePoint } from "@keybr/unicode";
import { flattenStyledText, splitStyledText } from "./chars.ts";
import { type TextInputSettings } from "./settings.ts";
import {
  Attr,
  type Char,
  Feedback,
  type LineList,
  type Step,
  type StyledText,
} from "./types.ts";

export type StepListener = (step: Step) => void;

const recoverBufferLength = 3;
const garbageBufferLength = 10;

export class TextInput {
  readonly text: StyledText;
  private readonly textItems: readonly Char[];
  readonly stopOnError: boolean;
  readonly forgiveErrors: boolean;
  readonly spaceSkipsWords: boolean;
  readonly onStep: StepListener;
  #steps: Step[] = [];
  #garbage: Step[] = [];
  #typo!: boolean;
  #chars!: Char[];
  #lines!: LineList;

  constructor(
    text: StyledText,
    { stopOnError, forgiveErrors, spaceSkipsWords }: TextInputSettings,
    onStep: StepListener = () => {},
  ) {
    this.text = text;
    this.textItems = splitStyledText(text);
    this.stopOnError = stopOnError;
    this.forgiveErrors = forgiveErrors;
    this.spaceSkipsWords = spaceSkipsWords;
    this.onStep = onStep;
    this.reset();
  }

  reset(): void {
    this.#steps = [];
    this.#garbage = [];
    this.#typo = false;
    this.#update();
  }

  get length(): number {
    return this.textItems.length;
  }

  at(index: number) {
    return this.textItems[index];
  }

  get pos(): number {
    return this.#steps.length;
  }

  get completed(): boolean {
    return this.pos === this.length;
  }

  get steps(): readonly Step[] {
    return this.#steps;
  }

  get chars(): readonly Char[] {
    return this.#chars;
  }

  get lines(): LineList {
    return this.#lines;
  }

  get suffix(): readonly CodePoint[] {
    return this.textItems
      .slice(this.#steps.length)
      .map(({ codePoint }) => codePoint);
  }

  onTextInput({
    timeStamp,
    inputType,
    codePoint,
  }: {
    readonly timeStamp: number;
    readonly inputType:
      | "appendChar"
      | "appendLineBreak"
      | "clearChar"
      | "clearWord";
    readonly codePoint: CodePoint;
  }): Feedback {
    switch (inputType) {
      case "appendChar":
        return this.appendChar(codePoint, timeStamp);
      case "appendLineBreak":
        return this.appendChar(0x0020, timeStamp);
      case "clearChar":
        return this.clearChar();
      case "clearWord":
        return this.clearWord();
    }
  }

  clearChar(): Feedback {
    const feedback = this.#clearChar();
    this.#update();
    return feedback;
  }

  #clearChar(): Feedback {
    if (this.#garbage.length > 0) {
      this.#garbage.pop();
    }
    this.#typo = true;
    return Feedback.Succeeded;
  }

  clearWord(): Feedback {
    const feedback = this.#clearWord();
    this.#update();
    return feedback;
  }

  #clearWord(): Feedback {
    if (this.#garbage.length > 0) {
      this.#garbage = [];
    }
    while (this.#steps.length > 0) {
      if (this.textItems[this.#steps.length - 1].codePoint !== 0x0020) {
        this.#steps.pop();
      } else {
        break;
      }
    }
    this.#typo = true;
    return Feedback.Succeeded;
  }

  appendChar(codePoint: CodePoint, timeStamp: number): Feedback {
    const feedback = this.#appendChar(codePoint, timeStamp);
    this.#update();
    return feedback;
  }

  #appendChar(codePoint: CodePoint, timeStamp: number): Feedback {
    if (this.completed) {
      // Cannot enter any more characters if already completed.
      throw new Error();
    }

    // Handle whitespace at the beginning of text.
    if (
      this.#steps.length === 0 &&
      this.#garbage.length === 0 &&
      !this.#typo &&
      codePoint === 0x0020
    ) {
      return Feedback.Succeeded;
    }

    // Handle the space key.
    if (
      this.textItems[this.#steps.length].codePoint !== 0x0020 &&
      codePoint === 0x0020
    ) {
      if (
        this.#garbage.length === 0 &&
        (this.#steps.length === 0 ||
          this.textItems[this.#steps.length - 1].codePoint === 0x0020)
      ) {
        // At the beginning of a word.
        this.#typo = true;
        return Feedback.Failed;
      }

      if (this.spaceSkipsWords) {
        // Inside a word.
        this.#skipWord(timeStamp);
        return Feedback.Recovered;
      }
    }

    // Handle correct input.
    if (
      filterText.normalize(this.textItems[this.#steps.length].codePoint) ===
        codePoint &&
      (this.forgiveErrors || this.#garbage.length === 0)
    ) {
      const typo = this.#typo;
      this.#addStep({
        codePoint,
        timeStamp,
        typo,
      });
      this.#garbage = [];
      this.#typo = false;
      if (typo) {
        return Feedback.Recovered;
      } else {
        return Feedback.Succeeded;
      }
    }

    // Handle incorrect input.
    this.#typo = true;
    if (!this.stopOnError || this.forgiveErrors) {
      if (this.#garbage.length < garbageBufferLength) {
        this.#garbage.push({
          codePoint,
          timeStamp,
          typo: false,
        });
      }
    }
    if (
      this.forgiveErrors &&
      (this.#handleReplacedCharacter() || this.#handleSkippedCharacter())
    ) {
      return Feedback.Recovered;
    }
    return Feedback.Failed;
  }

  #update() {
    this.#chars = this.#getChars();
    this.#lines = this.#getLines();
  }

  #getChars(): Char[] {
    const chars: Char[] = [];
    for (let i = 0; i < this.textItems.length; i++) {
      const item = this.textItems[i];
      if (i < this.#steps.length) {
        // Append characters before cursor.
        const step = this.#steps[i];
        chars.push({ ...item, attrs: step.typo ? Attr.Miss : Attr.Hit });
      } else if (i === this.#steps.length) {
        if (!this.stopOnError) {
          // Append buffered garbage.
          for (const { codePoint } of this.#garbage) {
            chars.push({ codePoint, attrs: Attr.Garbage, cls: null });
          }
        }
        // Append character at cursor.
        chars.push({ ...item, attrs: Attr.Cursor });
      } else {
        // Append characters after cursor.
        chars.push({ ...item, attrs: Attr.Normal });
      }
    }
    return chars;
  }

  #getLines(): LineList {
    const text = flattenStyledText(this.text);
    return { text, lines: [{ text, chars: this.chars }] };
  }

  #addStep(step: Step): void {
    this.#steps.push(step);
    this.onStep(step);
  }

  #skipWord(timeStamp: number): void {
    this.#addStep({
      codePoint: this.textItems[this.#steps.length].codePoint,
      timeStamp,
      typo: true,
    });
    // Skip the remaining non-space characters inside the word.
    while (
      this.#steps.length < this.textItems.length &&
      this.textItems[this.#steps.length].codePoint !== 0x0020
    ) {
      this.#addStep({
        codePoint: this.textItems[this.#steps.length].codePoint,
        timeStamp,
        typo: true,
      });
    }
    // Skip the space character to position at the beginning of the next word.
    if (
      this.#steps.length < this.textItems.length &&
      this.textItems[this.#steps.length].codePoint === 0x0020
    ) {
      this.#addStep({
        codePoint: this.textItems[this.#steps.length].codePoint,
        timeStamp,
        typo: false,
      });
    }
    this.#garbage = [];
    this.#typo = false;
  }

  #handleReplacedCharacter(): boolean {
    // text:    abcd
    // garbage: xbcd
    // offset:  0

    // Check if the buffer size is right.
    if (
      this.#garbage.length < recoverBufferLength + 1 ||
      this.#steps.length + recoverBufferLength + 1 > this.textItems.length
    ) {
      return false;
    }

    // Check if can recover.
    for (let i = 0; i < recoverBufferLength; i++) {
      const codePoint = this.textItems[this.#steps.length + i + 1].codePoint;
      if (codePoint !== this.#garbage[i + 1].codePoint) {
        return false;
      }
    }

    // Append a step with an error.
    this.#addStep({
      codePoint: this.textItems[this.#steps.length].codePoint,
      timeStamp: this.#garbage[0].timeStamp,
      typo: true,
    });

    // Append successful steps.
    for (let i = 1; i < this.#garbage.length; i++) {
      const { codePoint, timeStamp } = this.#garbage[i];
      this.#addStep({
        codePoint,
        timeStamp,
        typo: false,
      });
    }

    this.#garbage = [];
    this.#typo = false;
    return true;
  }

  #handleSkippedCharacter(): boolean {
    // text:    abcd
    // garbage: bcd
    // offset:  0

    // Check if the buffer size is right.
    if (
      this.#garbage.length < recoverBufferLength ||
      this.#steps.length + recoverBufferLength + 1 > this.textItems.length
    ) {
      return false;
    }

    // Check if can recover.
    for (let i = 0; i < recoverBufferLength; i++) {
      const codePoint = this.textItems[this.#steps.length + i + 1].codePoint;
      if (codePoint !== this.#garbage[i].codePoint) {
        return false;
      }
    }

    // Append a step with an error.
    this.#addStep({
      codePoint: this.textItems[this.#steps.length].codePoint,
      timeStamp: this.#garbage[0].timeStamp,
      typo: true,
    });

    // Append successful steps.
    for (let i = 0; i < this.#garbage.length; i++) {
      const { codePoint, timeStamp } = this.#garbage[i];
      this.#addStep({
        codePoint,
        timeStamp,
        typo: false,
      });
    }

    this.#garbage = [];
    this.#typo = false;
    return true;
  }
}
