import { toCodePoints } from "@keybr/unicode";
import { normalize, normalizeWhitespace } from "./normalize.ts";
import { type TextInputSettings } from "./settings.ts";
import {
  attrCursor,
  attrGarbage,
  attrHit,
  attrMiss,
  attrNormal,
  type Char,
  Feedback,
  type Step,
} from "./types.ts";

export type StepListener = (step: Step) => void;

const recoverBufferLength = 3;
const garbageBufferLength = 10;

export class TextInput {
  readonly text: string;
  readonly codePoints: readonly number[];
  readonly stopOnError: boolean;
  readonly forgiveErrors: boolean;
  readonly spaceSkipsWords: boolean;
  readonly onStep: StepListener;
  private _steps: Step[] = [];
  private _garbage: Step[] = [];
  private _typo: boolean = false;

  constructor(
    text: string,
    { stopOnError, forgiveErrors, spaceSkipsWords }: TextInputSettings,
    onStep: StepListener = () => {},
  ) {
    this.text = text.normalize("NFC");
    this.codePoints = [...toCodePoints(text)].map(normalizeWhitespace);
    this.stopOnError = stopOnError;
    this.forgiveErrors = forgiveErrors;
    this.spaceSkipsWords = spaceSkipsWords;
    this.onStep = onStep;
    this.reset();
  }

  reset(): void {
    this._steps = [];
    this._garbage = [];
    this._typo = false;
  }

  get completed(): boolean {
    return this._steps.length === this.codePoints.length;
  }

  step(codePoint: number, timeStamp: number): Feedback {
    if (this.completed) {
      // Cannot enter any more characters if already completed.
      throw new Error();
    }

    // Handle whitespace at the beginning of text.
    if (
      this._steps.length === 0 &&
      this._garbage.length === 0 &&
      !this._typo &&
      normalizeWhitespace(codePoint) === 0x0020
    ) {
      return Feedback.Succeeded;
    }

    // Handle the delete key.
    if (codePoint === 0x0008) {
      if (this._garbage.length > 0) {
        this._garbage.pop();
        return Feedback.Succeeded;
      } else {
        return Feedback.Failed;
      }
    }

    // Handle the space key.
    if (
      codePoint === 0x0020 &&
      this.codePoints[this._steps.length] !== 0x0020
    ) {
      if (
        this._garbage.length === 0 &&
        (this._steps.length === 0 ||
          this.codePoints[this._steps.length - 1] === 0x0020)
      ) {
        // At the beginning of a word.
        return Feedback.Succeeded;
      }

      if (this.spaceSkipsWords) {
        // Inside a word.
        this._handleSpace(timeStamp);
        return Feedback.Recovered;
      }
    }

    // Handle correct input.
    if (
      normalize(this.codePoints[this._steps.length]) === codePoint &&
      (this.forgiveErrors || this._garbage.length === 0)
    ) {
      const typo = this._typo;
      this._addStep({
        codePoint,
        timeStamp,
        typo,
      });
      this._garbage = [];
      this._typo = false;
      if (typo) {
        return Feedback.Recovered;
      } else {
        return Feedback.Succeeded;
      }
    }

    // Handle incorrect input.
    this._typo = true;
    if (!this.stopOnError || this.forgiveErrors) {
      if (this._garbage.length < garbageBufferLength) {
        this._garbage.push({
          codePoint,
          timeStamp,
          typo: false,
        });
      }
    }
    if (
      this.forgiveErrors &&
      (this._handleReplacedCharacter() || this._handleSkippedCharacter())
    ) {
      return Feedback.Recovered;
    }
    return Feedback.Failed;
  }

  getSteps(): readonly Step[] {
    return this._steps;
  }

  getChars(): readonly Char[] {
    const chars: Char[] = [];
    for (let i = 0; i < this.codePoints.length; i++) {
      const codePoint = this.codePoints[i];
      if (i < this._steps.length) {
        // Append characters before cursor.
        const step = this._steps[i];
        chars.push(toChar(codePoint, step.typo ? attrMiss : attrHit));
      } else if (i === this._steps.length) {
        if (!this.stopOnError) {
          // Append buffered garbage.
          for (const { codePoint } of this._garbage) {
            chars.push(toChar(codePoint, attrGarbage));
          }
        }
        // Append character at cursor.
        chars.push(toChar(codePoint, attrCursor));
      } else {
        // Append characters after cursor.
        chars.push(toChar(codePoint, attrNormal));
      }
    }
    return chars;
  }

  private _addStep(step: Step): void {
    this._steps.push(step);
    this.onStep(step);
  }

  private _handleSpace(timeStamp: number): void {
    this._addStep({
      codePoint: this.codePoints[this._steps.length],
      timeStamp,
      typo: true,
    });
    // Skip the remaining non-space characters inside the word.
    while (
      this._steps.length < this.codePoints.length &&
      this.codePoints[this._steps.length] !== 0x0020
    ) {
      this._addStep({
        codePoint: this.codePoints[this._steps.length],
        timeStamp,
        typo: true,
      });
    }
    // Skip the space character to position at the beginning of next word.
    if (
      this._steps.length < this.codePoints.length &&
      this.codePoints[this._steps.length] === 0x0020
    ) {
      this._addStep({
        codePoint: this.codePoints[this._steps.length],
        timeStamp,
        typo: false,
      });
    }
    this._garbage = [];
    this._typo = false;
  }

  private _handleReplacedCharacter(): boolean {
    // text:    abcd
    // garbage: xbcd
    // offset:  0

    // Check if the buffer size is right.
    if (
      this._garbage.length < recoverBufferLength + 1 ||
      this._steps.length + recoverBufferLength + 1 > this.codePoints.length
    ) {
      return false;
    }

    // Check if can recover.
    for (let i = 0; i < recoverBufferLength; i++) {
      const codePoint = this.codePoints[this._steps.length + i + 1];
      if (codePoint !== this._garbage[i + 1].codePoint) {
        return false;
      }
    }

    // Append a step with an error.
    this._addStep({
      codePoint: this.codePoints[this._steps.length],
      timeStamp: this._garbage[0].timeStamp,
      typo: true,
    });

    // Append successful steps.
    for (let i = 1; i < this._garbage.length; i++) {
      const { codePoint, timeStamp } = this._garbage[i];
      this._addStep({
        codePoint,
        timeStamp,
        typo: false,
      });
    }

    this._garbage = [];
    this._typo = false;
    return true;
  }

  private _handleSkippedCharacter(): boolean {
    // text:    abcd
    // garbage: bcd
    // offset:  0

    // Check if the buffer size is right.
    if (
      this._garbage.length < recoverBufferLength ||
      this._steps.length + recoverBufferLength + 1 > this.codePoints.length
    ) {
      return false;
    }

    // Check if can recover.
    for (let i = 0; i < recoverBufferLength; i++) {
      const codePoint = this.codePoints[this._steps.length + i + 1];
      if (codePoint !== this._garbage[i].codePoint) {
        return false;
      }
    }

    // Append a step with an error.
    this._addStep({
      codePoint: this.codePoints[this._steps.length],
      timeStamp: this._garbage[0].timeStamp,
      typo: true,
    });

    // Append successful steps.
    for (let i = 0; i < this._garbage.length; i++) {
      const { codePoint, timeStamp } = this._garbage[i];
      this._addStep({
        codePoint,
        timeStamp,
        typo: false,
      });
    }

    this._garbage = [];
    this._typo = false;
    return true;
  }
}

const charCache = new Map<number, Char>();

function toChar(codePoint: number, attrs: number): Char {
  const key = (codePoint & 0x00ff_ffff) | ((attrs & 0x0000_00ff) << 24);
  let char = charCache.get(key);
  if (char == null) {
    charCache.set(key, (char = { codePoint, attrs }));
  }
  return char;
}
