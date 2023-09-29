export class Vector implements Iterable<number> {
  readonly #values: number[] = [];

  constructor(values: Iterable<number> = []) {
    for (const value of values) {
      this.add(value);
    }
  }

  *[Symbol.iterator](): IterableIterator<number> {
    for (const item of this.#values) {
      yield item;
    }
  }

  add(value: number): void {
    if (value !== value) {
      throw new Error();
    }
    this.#values.push(value);
  }

  get length(): number {
    return this.#values.length;
  }

  at(index: number): number {
    if (!Number.isSafeInteger(index)) {
      throw new RangeError();
    }
    if (index < 0 || index >= this.#values.length) {
      throw new RangeError();
    }
    return this.#values[index];
  }
}
