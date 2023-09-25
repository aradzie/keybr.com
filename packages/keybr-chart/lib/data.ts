import { newFilter } from "@keybr/math";

export class Range {
  static from(vector: Iterable<number>): Range {
    const range = new Range();
    for (const item of vector) {
      range.min = item;
      range.max = item;
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

  get span() {
    return this.#max - this.#min;
  }

  round(step: number = 1): this {
    if (this.#max === this.#max) {
      const t = this.#max / step;
      const r = Math.floor(t);
      if (t !== r) {
        this.#max = (r + 1) * step;
      }
    }
    if (this.#min === this.#min) {
      const t = this.#min / step;
      const r = Math.ceil(t);
      if (t !== r) {
        this.#min = (r - 1) * step;
      }
    }
    return this;
  }
}

export class KeySet<T> implements Iterable<T> {
  readonly #set = new Set<T>();

  constructor(keys: Iterable<T>) {
    for (const key of keys) {
      this.add(key);
    }
  }

  *[Symbol.iterator](): Iterator<T> {
    for (const key of this.#set) {
      yield key;
    }
  }

  add(key: T): void {
    this.#set.add(key);
  }
}

export class Histogram<T> implements Iterable<[T, number]> {
  readonly #keySet: KeySet<T>;
  readonly #map: Map<T, number>;

  constructor(keySet: KeySet<T>) {
    this.#keySet = keySet;
    this.#map = new Map();
  }

  *[Symbol.iterator](): Iterator<[T, number]> {
    for (const key of this.#keySet) {
      yield [key, this.#map.get(key) ?? 0];
    }
  }

  asMap(): ReadonlyMap<T, number> {
    return new Map([...this.#map]);
  }

  asVector(): Vector {
    const vector = new Vector();
    for (const key of this.#keySet) {
      vector.add(this.#map.get(key) ?? 0);
    }
    return vector;
  }

  get(key: T): number {
    return this.#map.get(key) ?? 0;
  }

  set(key: T, value: number): void {
    this.#keySet.add(key);
    this.#map.set(key, value);
  }

  add(key: T, value: number): void {
    this.set(key, this.get(key) + value);
  }
}

export class Vector implements Iterable<number> {
  readonly #values: number[] = [];

  *[Symbol.iterator](): Iterator<number> {
    for (const item of this.#values) {
      yield item;
    }
  }

  add(value: number): void {
    this.#values.push(value);
  }

  get values(): readonly number[] {
    return this.#values;
  }

  get length(): number {
    return this.#values.length;
  }

  at(index: number): number {
    return this.#values[index];
  }
}

export const hasData = ({ length }: { readonly length: number }): boolean => {
  return length >= 5;
};

export const smooth = (smoothness: number) => {
  const filter = newFilter(1 / Math.pow(10, smoothness * 3));
  return (value: number): number => filter.add(value);
};

export const resample = (data: number[], newLength: number): number[] => {
  const { length } = data;
  const r = length / newLength;
  const result = new Array<number>(newLength);
  for (let i = 0; i < newLength; i++) {
    result[i] = data[Math.floor(i * r)]; // Nearest neighbour.
  }
  return result;
};
