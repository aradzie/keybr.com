import { filterText } from "@keybr/keyboard";
import { type CodePoint } from "@keybr/unicode";
import {
  Attr,
  type Char,
  flattenStyledText,
  type LineList,
  splitStyledText,
  type StyledText,
} from "./chars.ts";
import { type TextInputSettings } from "./settings.ts";

export enum Feedback {
  Succeeded,
  Recovered,
  Failed,
}

export type Step = {
  readonly timeStamp: number;
  readonly codePoint: CodePoint;
  readonly timeToType: number;
  readonly typo: boolean;
};

export type InputState = {
  readonly cursor: number;
  readonly steps: readonly Step[];
  readonly pending: readonly Step[];
  readonly typo: boolean;
  readonly completed: boolean;
};

export type InputEffect =
  | "accepted"
  | "rejected"
  | "ignored-space"
  | "delete-character"
  | "delete-word"
  | "skip-word"
  | "forgiven"
  | "replace-character"
  | "skip-character";

export type InputChange = {
  readonly before: InputState;
  readonly after: InputState;
  readonly feedback: Feedback;
  readonly effect: InputEffect;
};

export type TextInputObserver = (change: InputChange) => void;

export type StepListener = (step: Step) => void;

const recoverBufferLength = 3;
const garbageBufferLength = 10;

export class TextInput {
  readonly text: StyledText;
  readonly stopOnError: boolean;
  readonly forgiveErrors: boolean;
  readonly spaceSkipsWords: boolean;
  readonly onStep: StepListener;
  readonly #observer?: TextInputObserver;
  #effect: InputEffect = "accepted";
  readonly #text: string;
  readonly #chars: readonly Char[];
  #steps: (Step & { readonly char: Char })[] = [];
  #garbage: (Step & { readonly char: Char })[] = [];
  #typo!: boolean;
  #output!: { chars: Char[]; lines: LineList; remaining: Char[] };

  constructor(
    text: StyledText,
    { stopOnError, forgiveErrors, spaceSkipsWords }: TextInputSettings,
    onStep: StepListener = () => {},
    observer?: TextInputObserver,
  ) {
    this.#observer = observer;
    this.text = text;
    this.stopOnError = stopOnError;
    this.forgiveErrors = forgiveErrors;
    this.spaceSkipsWords = spaceSkipsWords;
    this.onStep = onStep;
    this.#text = flattenStyledText(text);
    this.#chars = splitStyledText(text);
    this.reset();
  }

  reset(): void {
    this.#steps = [];
    this.#garbage = [];
    this.#typo = false;
    this.#update();
  }

  get length(): number {
    return this.#chars.length;
  }

  at(index: number): Char {
    return this.#chars.at(index)!;
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
    return this.#output.chars;
  }

  get lines(): LineList {
    return this.#output.lines;
  }

  get remaining(): readonly Char[] {
    return this.#output.remaining;
  }

  /** Detached snapshots include hidden wrong characters even in stop-on-error mode. */
  snapshot(): InputState {
    const copy = ({ timeStamp, codePoint, timeToType, typo }: Step): Step => ({
      timeStamp,
      codePoint,
      timeToType,
      typo,
    });
    return {
      cursor: this.pos,
      steps: this.#steps.map(copy),
      pending: this.#garbage.map(copy),
      typo: this.#typo,
      completed: this.completed,
    };
  }

  #observe(operation: () => Feedback): Feedback {
    const before = this.#observer ? this.snapshot() : null;
    const feedback = operation();
    if (before != null) {
      // Observers must never affect native input, scores, or progression.
      try {
        this.#observer?.({
          before,
          after: this.snapshot(),
          feedback,
          effect: this.#effect,
        });
      } catch {
        /* Observation is optional. */
      }
    }
    return feedback;
  }

  clearChar(): Feedback {
    return this.#observe(() => this.#clearChar());
  }

  clearWord(): Feedback {
    return this.#observe(() => this.#clearWord());
  }

  appendChar(
    timeStamp: number,
    codePoint: CodePoint,
    timeToType: number,
  ): Feedback {
    return this.#observe(() =>
      this.#appendChar(timeStamp, codePoint, timeToType),
    );
  }

  onInput({
    timeStamp,
    inputType,
    codePoint,
    timeToType,
  }: {
    readonly timeStamp: number;
    readonly inputType:
      "appendChar" | "appendLineBreak" | "clearChar" | "clearWord";
    readonly codePoint: CodePoint;
    readonly timeToType: number;
  }): Feedback {
    switch (inputType) {
      case "appendChar":
        return this.appendChar(timeStamp, codePoint, timeToType);
      case "appendLineBreak":
        return this.appendChar(timeStamp, 0x0020, timeToType);
      case "clearChar":
        return this.clearChar();
      case "clearWord":
        return this.clearWord();
    }
  }

  #clearChar(): Feedback {
    this.#garbage.pop();
    this.#typo = true;
    return this.#return(Feedback.Succeeded, "delete-character");
  }

  #clearWord(): Feedback {
    this.#garbage = [];
    while (this.pos > 0 && this.at(this.pos - 1).codePoint !== 0x0020) {
      this.#steps.pop();
    }
    this.#typo = true;
    return this.#return(Feedback.Succeeded, "delete-word");
  }

  #appendChar(
    timeStamp: number,
    codePoint: CodePoint,
    timeToType: number,
  ): Feedback {
    if (this.completed) {
      throw new Error();
    }

    const { codePoint: expected } = this.at(this.pos);

    if (expected !== 0x0020 && codePoint === 0x0020) {
      if (
        this.spaceSkipsWords &&
        ((this.pos > 0 && this.at(this.pos - 1).codePoint !== 0x0020) ||
          this.#typo)
      ) {
        this.#skipWord(timeStamp);
        return this.#return(Feedback.Recovered, "skip-word");
      }
      if (this.#garbage.length === 0 && !this.#typo) {
        return this.#return(Feedback.Succeeded, "ignored-space");
      }
    }

    if (
      (expected === codePoint ||
        filterText.normalize(expected) === codePoint) &&
      (this.forgiveErrors || this.#garbage.length === 0)
    ) {
      const typo = this.#typo;
      this.#addStep(
        {
          timeStamp,
          codePoint,
          timeToType,
          typo,
        },
        this.at(this.pos),
      );
      this.#garbage = [];
      this.#typo = false;
      if (typo) {
        return this.#return(Feedback.Recovered, "forgiven");
      } else {
        return this.#return(Feedback.Succeeded, "accepted");
      }
    }

    this.#typo = true;
    if (!this.stopOnError || this.forgiveErrors) {
      if (this.#garbage.length < garbageBufferLength) {
        this.#garbage.push({
          char: {
            codePoint,
            attrs: Attr.Garbage,
            cls: null,
          },
          timeStamp,
          codePoint,
          timeToType,
          typo: false,
        });
      }
    }
    if (
      this.forgiveErrors &&
      (this.#handleReplacedCharacter() || this.#handleSkippedCharacter())
    ) {
      return this.#return(Feedback.Recovered, this.#effect);
    } else {
      return this.#return(Feedback.Failed, "rejected");
    }
  }

  #return(feedback: Feedback, effect: InputEffect): Feedback {
    this.#effect = effect;
    this.#update();
    return feedback;
  }

  #update(): void {
    const text = this.#text;
    const remaining = this.#chars.slice(this.pos);
    const chars = [];
    chars.push(...this.#steps.map(({ char }) => char));
    if (!this.stopOnError) {
      chars.push(...this.#garbage.map(({ char }) => char));
    }
    if (remaining.length > 0) {
      const [head, ...tail] = remaining;
      chars.push({ ...head, attrs: Attr.Cursor }, ...tail);
    }
    const lines = { text, lines: [{ text, chars }] };
    this.#output = { chars, lines, remaining };
  }

  #addStep(step: Step, char: Char): void {
    const attrs = step.typo ? Attr.Miss : Attr.Hit;
    this.#steps.push({ ...step, char: { ...char, attrs } });
    this.onStep(step);
  }

  #skipWord(timeStamp: number): void {
    // Skip the remaining non-space characters inside the word.
    while (this.pos < this.length && this.at(this.pos).codePoint !== 0x0020) {
      this.#addStep(
        {
          timeStamp,
          codePoint: this.at(this.pos).codePoint,
          timeToType: 0,
          typo: true,
        },
        this.at(this.pos),
      );
    }
    // Skip the space character to position at the beginning of the next word.
    if (this.pos < this.length && this.at(this.pos).codePoint === 0x0020) {
      this.#addStep(
        {
          timeStamp,
          codePoint: this.at(this.pos).codePoint,
          timeToType: 0,
          typo: false,
        },
        this.at(this.pos),
      );
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
      this.pos + recoverBufferLength + 1 > this.length ||
      this.#garbage.length < recoverBufferLength + 1
    ) {
      return false;
    }

    // Check whether we can recover.
    for (let i = 0; i < recoverBufferLength; i++) {
      const char = this.at(this.pos + i + 1);
      if (char.codePoint !== this.#garbage[i + 1].codePoint) {
        return false;
      }
    }

    this.#effect = "replace-character";
    // Append a step with an error.
    this.#addStep(
      {
        timeStamp: this.#garbage[0].timeStamp,
        codePoint: this.at(this.pos).codePoint,
        timeToType: 0,
        typo: true,
      },
      this.at(this.pos),
    );

    // Append successful steps.
    for (let i = 1; i < this.#garbage.length; i++) {
      this.#addStep(this.#garbage[i], this.#garbage[i].char);
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
      this.pos + recoverBufferLength + 1 > this.length ||
      this.#garbage.length < recoverBufferLength
    ) {
      return false;
    }

    // Check whether we can recover.
    for (let i = 0; i < recoverBufferLength; i++) {
      const char = this.at(this.pos + i + 1);
      if (char.codePoint !== this.#garbage[i].codePoint) {
        return false;
      }
    }

    this.#effect = "skip-character";
    // Append a step with an error.
    this.#addStep(
      {
        timeStamp: this.#garbage[0].timeStamp,
        codePoint: this.at(this.pos).codePoint,
        timeToType: 0,
        typo: true,
      },
      this.at(this.pos),
    );

    // Append successful steps.
    for (let i = 0; i < this.#garbage.length; i++) {
      this.#addStep(this.#garbage[i], this.#garbage[i].char);
    }

    this.#garbage = [];
    this.#typo = false;
    return true;
  }
}
