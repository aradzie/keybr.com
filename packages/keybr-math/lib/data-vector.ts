export class Vector implements Iterable<number> {
  readonly #values: number[] = [];

  constructor(data: Iterable<number> = []) {
    this.#values.push(...data);
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

  get values(): readonly number[] {
    return this.#values;
  }

  get length(): number {
    return this.#values.length;
  }

  at(index: number): number {
    if (index < 0 || index >= this.#values.length) {
      throw new RangeError();
    }
    return this.#values[index];
  }
}
