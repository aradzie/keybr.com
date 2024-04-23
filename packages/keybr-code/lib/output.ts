export class Output {
  static readonly Stop = new Error("STOP");

  readonly #limit: number;
  readonly #data: string[] = [];
  #length: number = 0;
  #separator: string = "";
  #text: string | null = null;

  constructor(limit: number = 1000) {
    this.#limit = limit;
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
    const { length } = text;
    if (length > 0) {
      if (this.#length + length > this.#limit) {
        throw Output.Stop;
      }
    }
    this.#separator = text;
    return this;
  }

  /** Appends the given text, or throws the stop error if the limit is reached. */
  append(text: string): this {
    const { length } = text;
    if (length > 0) {
      if (this.#length + this.#separator.length + length > this.#limit) {
        throw Output.Stop;
      }
      if (this.#separator.length > 0) {
        this.#data.push(this.#separator);
        this.#length += this.#separator.length;
        this.#separator = "";
      }
      this.#data.push(text);
      this.#length += length;
      this.#text = null;
    }
    return this;
  }

  /** Clears the accumulated text. */
  clear(): this {
    this.#data.length = 0;
    this.#length = 0;
    this.#separator = "";
    this.#text = null;
    return this;
  }

  toString() {
    return (this.#text ??= this.#data.join(""));
  }
}
