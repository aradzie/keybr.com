import { type StyledText, type StyledTextSpan } from "@keybr/textinput";

export class Output {
  static readonly Stop = new Error("STOP");

  readonly #limit: number;
  readonly #text: (string | StyledTextSpan)[] = [];
  #length: number = 0;
  #separator: string = "";

  constructor(limit: number = 1000) {
    this.#limit = limit;
  }

  get text(): StyledText {
    return this.#text;
  }

  /** Returns the number of characters accumulated in the output. */
  get length(): number {
    return this.#length + this.#separator.length;
  }

  /** Returns the number of remaining characters before the limit is reached. */
  get remaining(): number {
    return this.#limit - (this.#length + this.#separator.length);
  }

  /** Appends the given text, but only if followed by the `append(...)` method. */
  separate(text: string): this {
    if (this.#text.length > 0) {
      const { length } = text;
      if (length > 0) {
        if (this.#length + length > this.#limit) {
          throw Output.Stop;
        }
      }
      this.#separator = text;
    }
    return this;
  }

  /** Appends the given text, or throws the stop error if the limit is reached. */
  append(text: string, cls: string | null = null): this {
    if ((text === " " || text === "\n" || text === "\t") && cls == null) {
      return this.separate(text);
    }
    const { length } = text;
    if (length > 0) {
      if (this.#length + this.#separator.length + length > this.#limit) {
        throw Output.Stop;
      }
      if (this.#separator.length > 0) {
        this.#text.push(this.#separator);
        this.#length += this.#separator.length;
        this.#separator = "";
      }
      this.#text.push(cls != null ? { cls, text } : text);
      this.#length += length;
    }
    return this;
  }

  /** Clears the accumulated text. */
  clear(): this {
    this.#text.length = 0;
    this.#length = 0;
    this.#separator = "";
    return this;
  }
}
