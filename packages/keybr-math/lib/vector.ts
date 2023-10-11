export class Vector implements Iterable<number> {
  private readonly _values: number[] = [];

  constructor(values: Iterable<number> = []) {
    for (const value of values) {
      this.add(value);
    }
  }

  *[Symbol.iterator](): IterableIterator<number> {
    for (const item of this._values) {
      yield item;
    }
  }

  add(value: number): void {
    if (value !== value) {
      throw new Error();
    }
    this._values.push(value);
  }

  get length(): number {
    return this._values.length;
  }

  at(index: number): number {
    if (!Number.isSafeInteger(index)) {
      throw new RangeError();
    }
    if (index < 0 || index >= this._values.length) {
      throw new RangeError();
    }
    return this._values[index];
  }
}
