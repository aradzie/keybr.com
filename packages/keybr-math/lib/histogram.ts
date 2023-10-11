import { KeySet } from "./keyset.ts";
import { Vector } from "./vector.ts";

export class Histogram<T> implements Iterable<[T, number]> {
  private readonly _keySet: KeySet<T>;
  private readonly _map: Map<T, number>;

  static from<T>(items: Iterable<[T, number]>): Histogram<T> {
    const histogram = new Histogram<T>(new KeySet<T>([]));
    for (const [key, value] of items) {
      histogram.set(key, value);
    }
    return histogram;
  }

  constructor(keySet: KeySet<T>) {
    this._keySet = keySet;
    this._map = new Map();
  }

  *[Symbol.iterator](): IterableIterator<[T, number]> {
    for (const key of this._keySet) {
      yield [key, this.get(key)];
    }
  }

  *keys(): IterableIterator<T> {
    for (const key of this._keySet) {
      yield key;
    }
  }

  *values(): IterableIterator<number> {
    for (const key of this._keySet) {
      yield this.get(key);
    }
  }

  asVector(): Vector {
    return new Vector(this.values());
  }

  has(key: T): boolean {
    return this._map.has(key);
  }

  get(key: T): number {
    return this._map.get(key) ?? 0;
  }

  set(key: T, value: number): void {
    if (value !== value || value < 0) {
      throw new Error();
    }
    this._keySet.add(key);
    this._map.set(key, value);
  }

  add(key: T, value: number): void {
    if (value !== value || value < 0) {
      throw new Error();
    }
    this._keySet.add(key);
    this._map.set(key, this.get(key) + value);
  }
}
