export class Range {
  static from(values: Iterable<number>, ...rest: Iterable<number>[]): Range {
    const range = new Range();
    range.adjust(values);
    for (const values of rest) {
      range.adjust(values);
    }
    return range;
  }

  private _min: number = NaN;
  private _max: number = NaN;

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
      this._min = a0._min;
      this._max = a0._max;
      return;
    }
    if (
      l === 2 &&
      typeof (a0 = args[0]) === "number" &&
      typeof (a1 = args[1]) === "number"
    ) {
      this._min = a0;
      this._max = a1;
      return;
    }
    throw new TypeError();
  }

  get defined(): boolean {
    return this._min === this._min && this._max === this._max;
  }

  get min(): number {
    return this._min;
  }

  set min(value: number) {
    this._min = this._min === this._min ? Math.min(this._min, value) : value;
  }

  get max(): number {
    return this._max;
  }

  set max(value: number) {
    this._max = this._max === this._max ? Math.max(this._max, value) : value;
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
    return this._max - this._min;
  }

  normalize(value: number): number {
    if (!this.defined) {
      throw new RangeError();
    }
    if (this._max === this._min) {
      return this._min;
    } else {
      return (value - this._min) / (this._max - this._min);
    }
  }

  round(step: number): this {
    if (!this.defined) {
      throw new RangeError();
    }
    const t0 = this._max / step;
    const r0 = Math.floor(t0);
    if (t0 !== r0) {
      this._max = (r0 + 1) * step;
    }
    const t1 = this._min / step;
    const r1 = Math.ceil(t1);
    if (t1 !== r1) {
      this._min = (r1 - 1) * step;
    }
    return this;
  }
}
