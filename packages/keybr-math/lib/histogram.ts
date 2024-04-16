import { KeySet } from "./keyset.ts";
import { Vector } from "./vector.ts";

export class Histogram<T> implements Iterable<[T, number]> {
  readonly #keySet: KeySet<T>;
  readonly #map: Map<T, number>;

  static from<T>(items: Iterable<[T, number]>): Histogram<T> {
    const histogram = new Histogram<T>(new KeySet<T>([]));
    for (const [key, value] of items) {
      histogram.set(key, value);
    }
    return histogram;
  }

  constructor(keySet: KeySet<T>) {
    this.#keySet = keySet;
    this.#map = new Map();
  }

  *[Symbol.iterator](): IterableIterator<[T, number]> {
    for (const key of this.#keySet) {
      yield [key, this.get(key)];
    }
  }

  *keys(): IterableIterator<T> {
    for (const key of this.#keySet) {
      yield key;
    }
  }

  *values(): IterableIterator<number> {
    for (const key of this.#keySet) {
      yield this.get(key);
    }
  }

  asVector(): Vector {
    return new Vector(this.values());
  }

  has(key: T): boolean {
    return this.#map.has(key);
  }

  get(key: T): number {
    return this.#map.get(key) ?? 0;
  }

  set(key: T, value: number): void {
    if (value !== value || value < 0) {
      throw new Error();
    }
    this.#keySet.add(key);
    this.#map.set(key, value);
  }

  add(key: T, value: number): void {
    if (value !== value || value < 0) {
      throw new Error();
    }
    this.#keySet.add(key);
    this.#map.set(key, this.get(key) + value);
  }
}
