export class KeySet<T> implements Iterable<T> {
  private readonly _keys = new Set<T>();

  constructor(keys: Iterable<T>) {
    for (const key of keys) {
      this.add(key);
    }
  }

  *[Symbol.iterator](): IterableIterator<T> {
    for (const key of this._keys) {
      yield key;
    }
  }

  add(key: T): void {
    this._keys.add(key);
  }
}
