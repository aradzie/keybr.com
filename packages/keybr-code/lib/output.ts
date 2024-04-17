export class Output {
  static readonly Stop = new Error("STOP");

  readonly #limit: number;
  readonly #data: string[] = [];
  #length: number = 0;
  #text: string | null = null;

  constructor(limit: number = 1000) {
    this.#limit = limit;
  }

  /** Returns the number of characters accumulated in the output. */
  get length(): number {
    return this.#length;
  }

  /** Returns the number of remaining characters before the limit is reached. */
  get remaining(): number {
    return this.#limit - this.#length;
  }

  /** Appends the given text, or throws the stop error if the limit is reached. */
  append(text: string): this {
    const { length } = text;
    if (length > 0) {
      if (this.#length + length > this.#limit) {
        throw Output.Stop;
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
    this.#text = null;
    return this;
  }

  toString() {
    return (this.#text ??= this.#data.join(""));
  }
}
