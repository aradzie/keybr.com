export class ObjectStorage implements Iterable<string> {
  private readonly _storage: Storage;

  constructor(storage: Storage = localStorage) {
    this._storage = storage;
  }

  *[Symbol.iterator](): IterableIterator<string> {
    const { length } = this._storage;
    for (let i = 0; i < length; i++) {
      const key = this._storage.key(i);
      if (key != null) {
        yield key;
      }
    }
  }

  set(name: string, value: unknown | null): void {
    if (value == null) {
      this._storage.removeItem(name);
    } else {
      this._storage.setItem(name, JSON.stringify(value));
    }
  }

  get<T>(name: string): T | null {
    const value = this._storage.getItem(name);
    if (value != null) {
      try {
        return JSON.parse(value) as T;
      } catch {
        return null;
      }
    } else {
      return null;
    }
  }
}
