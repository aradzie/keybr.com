export class Range {
  static from(values: Iterable<number>, ...rest: Iterable<number>[]): Range {
    const range = new Range();
    range.adjust(values);
    for (const values of rest) {
      range.adjust(values);
    }
    return range;
  }

  #min: number = NaN;
  #max: number = NaN;

  constructor();
  constructor(that: Range);
  constructor(min: number, max: number);
  constructor(...args: any) {
    const l = args.length;
    let a0, a1;
    if (l === 0) {
      return;
    }
    if (l === 1 && (a0 = args[0]) instanceof Range) {
      this.#min = a0.#min;
      this.#max = a0.#max;
      return;
    }
    if (
      l === 2 &&
      typeof (a0 = args[0]) === "number" &&
      typeof (a1 = args[1]) === "number"
    ) {
      this.#min = a0;
      this.#max = a1;
      return;
    }
    throw new TypeError();
  }

  get defined(): boolean {
    return this.#min === this.#min && this.#max === this.#max;
  }

  get min(): number {
    return this.#min;
  }

  set min(value: number) {
    this.#min = this.#min === this.#min ? Math.min(this.#min, value) : value;
  }

  get max(): number {
    return this.#max;
  }

  set max(value: number) {
    this.#max = this.#max === this.#max ? Math.max(this.#max, value) : value;
  }

  adjust(values: Iterable<number>): this {
    for (const value of values) {
      this.min = value;
      this.max = value;
    }
    return this;
  }

  get span(): number {
    if (!this.defined) {
      throw new RangeError();
    }
    return this.#max - this.#min;
  }

  normalize(value: number): number {
    if (!this.defined) {
      throw new RangeError();
    }
    if (this.#max === this.#min) {
      return this.#min;
    } else {
      return (value - this.#min) / (this.#max - this.#min);
    }
  }

  round(step: number): this {
    if (!this.defined) {
      throw new RangeError();
    }
    const t0 = this.#max / step;
    const r0 = Math.floor(t0);
    if (t0 !== r0) {
      this.#max = (r0 + 1) * step;
    }
    const t1 = this.#min / step;
    const r1 = Math.ceil(t1);
    if (t1 !== r1) {
      this.#min = (r1 - 1) * step;
    }
    return this;
  }
}
