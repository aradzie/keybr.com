export type EnumItem = {
  readonly id: string;
  toString(): string;
  toJSON(): string;
};

export class Enum<T extends EnumItem> implements Iterable<T> {
  readonly #items: readonly T[];
  readonly #byId: Map<string, T>;

  constructor(...items: readonly T[]) {
    this.#items = [...items];
    this.#byId = new Map();
    for (const item of this.#items) {
      if (this.#byId.has(item.id)) {
        throw new Error(
          process.env.NODE_ENV !== "production"
            ? `Duplicate item id ${item.id}`
            : undefined,
        );
      } else {
        this.#byId.set(item.id, item);
      }
    }
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.#items[Symbol.iterator]();
  }

  get size(): number {
    return this.#items.length;
  }

  at(index: number): T {
    if (!Number.isInteger(index) || index < 0 || index >= this.#items.length) {
      throw new RangeError(
        process.env.NODE_ENV !== "production"
          ? `Invalid item index ${index}`
          : undefined,
      );
    }
    return this.#items[index];
  }

  indexOf(item: T): number {
    return this.#items.indexOf(item);
  }

  has(item: T): boolean {
    return this.#items.includes(item);
  }

  get(id: string): T;
  get(id: string | null, defaultValue: T): T;
  get(id: string | null, defaultValue: T | null): T | null;
  get(id: string, defaultValue: T | null = null): T | null {
    let item: T | null = this.#byId.get(id) ?? null;
    if (item == null) {
      if (defaultValue == null) {
        throw new Error(
          process.env.NODE_ENV !== "production"
            ? `Item [${id}] not found`
            : undefined,
        );
      } else {
        item = defaultValue;
      }
    }
    return item;
  }

  map<U>(fn: (value: T, index: number) => U): U[] {
    return this.#items.map((value, index) => fn(value, index));
  }

  filter(fn: (value: T, index: number) => unknown): T[] {
    return this.#items.filter((value, index) => fn(value, index));
  }

  find(fn: (value: T, index: number) => boolean): T | undefined {
    return this.#items.find((value, index) => fn(value, index));
  }
}

export type XEnumItem = {
  readonly id: string;
  readonly xid: number;
  toString(): string;
  toJSON(): string;
};

export class XEnum<T extends XEnumItem> implements Iterable<T> {
  readonly #items: readonly T[];
  readonly #byId: Map<string, T>;
  readonly #byXId: Map<number, T>;

  constructor(...items: readonly T[]) {
    this.#items = [...items];
    this.#byId = new Map();
    for (const item of this.#items) {
      if (this.#byId.has(item.id)) {
        throw new Error(
          process.env.NODE_ENV !== "production"
            ? `Duplicate item id ${item.id}`
            : undefined,
        );
      } else {
        this.#byId.set(item.id, item);
      }
    }
    this.#byXId = new Map();
    for (const item of this.#items) {
      if (this.#byXId.has(item.xid)) {
        throw new Error(
          process.env.NODE_ENV !== "production"
            ? `Duplicate item xid ${item.xid}`
            : undefined,
        );
      } else {
        this.#byXId.set(item.xid, item);
      }
    }
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.#items[Symbol.iterator]();
  }

  get size(): number {
    return this.#items.length;
  }

  at(index: number): T {
    if (!Number.isInteger(index) || index < 0 || index >= this.#items.length) {
      throw new RangeError(
        process.env.NODE_ENV !== "production"
          ? `Invalid item index ${index}`
          : undefined,
      );
    }
    return this.#items[index];
  }

  indexOf(item: T): number {
    return this.#items.indexOf(item);
  }

  has(item: T): boolean {
    return this.#items.includes(item);
  }

  get(id: string): T;
  get(id: string | null, defaultValue: T): T;
  get(id: string | null, defaultValue: T | null): T | null;
  get(id: string, defaultValue: T | null = null): T | null {
    let item: T | null = this.#byId.get(id) ?? null;
    if (item == null) {
      if (defaultValue == null) {
        throw new Error(
          process.env.NODE_ENV !== "production"
            ? `Item id [${id}] not found`
            : undefined,
        );
      } else {
        item = defaultValue;
      }
    }
    return item;
  }

  xget(xid: number): T;
  xget(xid: number | null, defaultValue: T): T;
  xget(xid: number | null, defaultValue: T | null): T | null;
  xget(xid: number, defaultValue: T | null = null): T | null {
    let item: T | null = this.#byXId.get(xid) ?? null;
    if (item == null) {
      if (defaultValue == null) {
        throw new Error(
          process.env.NODE_ENV !== "production"
            ? `Item xid [${xid}] not found`
            : undefined,
        );
      } else {
        item = defaultValue;
      }
    }
    return item;
  }

  map<U>(fn: (value: T, index: number) => U): U[] {
    return this.#items.map((value, index) => fn(value, index));
  }

  filter(fn: (value: T, index: number) => unknown): T[] {
    return this.#items.filter((value, index) => fn(value, index));
  }

  find(fn: (value: T, index: number) => boolean): T | undefined {
    return this.#items.find((value, index) => fn(value, index));
  }
}
