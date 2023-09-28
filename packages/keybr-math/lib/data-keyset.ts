export class KeySet<T> implements Iterable<T> {
  readonly #set = new Set<T>();

  constructor(keys: Iterable<T>) {
    for (const key of keys) {
      this.add(key);
    }
  }

  *[Symbol.iterator](): IterableIterator<T> {
    for (const key of this.#set) {
      yield key;
    }
  }

  add(key: T): void {
    this.#set.add(key);
  }
}
