export class KeySet<T> implements Iterable<T> {
  readonly #keys = new Set<T>();

  constructor(keys: Iterable<T>) {
    for (const key of keys) {
      this.add(key);
    }
  }

  *[Symbol.iterator](): IterableIterator<T> {
    for (const key of this.#keys) {
      yield key;
    }
  }

  add(key: T): void {
    this.#keys.add(key);
  }
}
