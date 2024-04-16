export class ObjectStorage implements Iterable<string> {
  readonly #storage: Storage;

  constructor(storage: Storage = localStorage) {
    this.#storage = storage;
  }

  *[Symbol.iterator](): IterableIterator<string> {
    const { length } = this.#storage;
    for (let i = 0; i < length; i++) {
      const key = this.#storage.key(i);
      if (key != null) {
        yield key;
      }
    }
  }

  set(name: string, value: unknown | null): void {
    if (value == null) {
      this.#storage.removeItem(name);
    } else {
      this.#storage.setItem(name, JSON.stringify(value));
    }
  }

  get<T>(name: string): T | null {
    const value = this.#storage.getItem(name);
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
