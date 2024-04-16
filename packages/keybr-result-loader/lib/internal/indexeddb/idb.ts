import { AbortedError, BlockedError } from "./errors.ts";

export type Migration = {
  (
    db: DBDatabase,
    tx: DBTransaction,
    oldVersion: number,
    newVersion: number | null,
  ): Promise<void>;
};

export class DBNamedFactory {
  readonly #name: string;
  readonly #version: number;
  readonly #factory: DBFactory;

  constructor(factory: IDBFactory, name: string, version: number) {
    this.#name = name;
    this.#version = version;
    this.#factory = new DBFactory(factory);
  }

  get name(): string {
    return this.#name;
  }

  get version(): number {
    return this.#version;
  }

  openDatabase(migration: Migration): Promise<DBDatabase> {
    return this.#factory.openDatabase(this.#name, this.#version, migration);
  }

  deleteDatabase(): Promise<void> {
    return this.#factory.deleteDatabase(this.#name);
  }

  get [Symbol.toStringTag]() {
    return "DBNamedFactory";
  }
}

export class DBFactory {
  readonly #factory: IDBFactory;

  constructor(factory: IDBFactory) {
    this.#factory = factory;
  }

  openDatabase(
    name: string,
    version: number,
    migration: Migration,
  ): Promise<DBDatabase> {
    const request = this.#factory.open(name, version);
    return new Promise<DBDatabase>((resolve, reject) => {
      request.onerror = (ev) => {
        console.error("IndexedDB open database error", request.error);
        reject(request.error);
      };
      request.onblocked = (ev) => {
        reject(new BlockedError("Database is blocked"));
      };
      request.onupgradeneeded = (ev) => {
        const db = new DBDatabase(request.result as IDBDatabase);
        const tx = new DBTransaction(request.transaction as IDBTransaction);
        migration(db, tx, ev.oldVersion, ev.newVersion)
          .then(() => tx.completed)
          .then(
            () => {
              resolve(db);
            },
            (error) => {
              reject(error);
            },
          );
      };
      request.onsuccess = (ev) => {
        const db = new DBDatabase(request.result as IDBDatabase);
        resolve(db);
      };
    });
  }

  deleteDatabase(name: string): Promise<void> {
    const request = this.#factory.deleteDatabase(name);
    return new Promise<void>((resolve, reject) => {
      request.onerror = (ev) => {
        console.error("IndexedDB delete database error", request.error);
        reject(request.error);
      };
      request.onblocked = (ev) => {
        reject(new BlockedError("Database is blocked"));
      };
      request.onsuccess = (ev) => {
        resolve();
      };
    });
  }

  get [Symbol.toStringTag]() {
    return "DBFactory";
  }
}

export class DBDatabase {
  readonly #db: IDBDatabase;

  constructor(db: IDBDatabase) {
    this.#db = db;
  }

  get name(): string {
    return this.#db.name;
  }

  get version(): number {
    return this.#db.version;
  }

  get objectStoreNames(): string[] {
    return Array.from(this.#db.objectStoreNames);
  }

  createObjectStore(
    name: string,
    options?: IDBObjectStoreParameters,
  ): DBObjectStore {
    return new DBObjectStore(this.#db.createObjectStore(name, options));
  }

  deleteObjectStore(name: string): void {
    this.#db.deleteObjectStore(name);
  }

  transaction(
    storeNames: string | string[],
    mode?: IDBTransactionMode,
    options?: IDBTransactionOptions,
  ): DBTransaction {
    return new DBTransaction(this.#db.transaction(storeNames, mode, options));
  }

  close(): void {
    this.#db.close();
  }

  get [Symbol.toStringTag]() {
    return "DBDatabase";
  }
}

export class DBTransaction {
  readonly #tx: IDBTransaction;
  readonly completed: Promise<void>;

  constructor(tx: IDBTransaction) {
    this.#tx = tx;
    this.completed = promisifyTransaction(tx);
  }

  get mode(): IDBTransactionMode {
    return this.#tx.mode;
  }

  get durability(): IDBTransactionDurability {
    return this.#tx.durability;
  }

  get error(): DOMException | null {
    return this.#tx.error;
  }

  abort(): void {
    this.#tx.abort();
  }

  commit(): void {
    this.#tx.commit();
  }

  objectStore(name: string): DBObjectStore {
    return new DBObjectStore(this.#tx.objectStore(name));
  }

  get [Symbol.toStringTag]() {
    return "DBTransaction";
  }
}

export class DBObjectStore {
  readonly #store: IDBObjectStore;

  constructor(store: IDBObjectStore) {
    this.#store = store;
  }

  get name(): string {
    return this.#store.name;
  }

  get autoIncrement(): boolean {
    return this.#store.autoIncrement;
  }

  get indexNames(): string[] {
    return Array.from(this.#store.indexNames);
  }

  get keyPath(): string | string[] {
    return this.#store.keyPath;
  }

  createIndex(
    name: string,
    keyPath: string | string[],
    options?: IDBIndexParameters,
  ): DBIndex {
    return new DBIndex(this.#store.createIndex(name, keyPath, options));
  }

  deleteIndex(name: string): void {
    this.#store.deleteIndex(name);
  }

  index(name: string): DBIndex {
    return new DBIndex(this.#store.index(name));
  }

  count(key?: IDBValidKey | IDBKeyRange): Promise<number> {
    return promisifyRequest<number>(this.#store.count(key));
  }

  get(key: IDBValidKey): Promise<any> {
    return promisifyRequest(this.#store.get(key));
  }

  getAll(
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number,
  ): Promise<any[]> {
    return promisifyRequest(this.#store.getAll(query, count));
  }

  getAllKeys(
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number,
  ): Promise<IDBValidKey[]> {
    return promisifyRequest(this.#store.getAllKeys(query, count));
  }

  add(value: any, key?: IDBValidKey): Promise<IDBValidKey> {
    return promisifyRequest<IDBValidKey>(this.#store.add(value, key));
  }

  put(value: any, key?: IDBValidKey): Promise<IDBValidKey> {
    return promisifyRequest<IDBValidKey>(this.#store.put(value, key));
  }

  delete(key: IDBValidKey | IDBKeyRange): Promise<void> {
    return promisifyRequest<void>(this.#store.delete(key));
  }

  clear(): Promise<void> {
    return promisifyRequest<void>(this.#store.clear());
  }

  openCursor(
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,
  ): Promise<IDBCursorWithValue | null> {
    return promisifyRequest(this.#store.openCursor(query, direction));
  }

  openKeyCursor(
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,
  ): Promise<IDBCursor | null> {
    return promisifyRequest(this.#store.openKeyCursor(query, direction));
  }

  readAll<T>(
    parse: (key: IDBValidKey, value: any) => T | null,
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,
  ): Promise<T[]> {
    return readAll(parse, this.#store.openCursor(query, direction));
  }

  get [Symbol.toStringTag]() {
    return "DBObjectStore";
  }
}

export class DBIndex {
  readonly #index: IDBIndex;

  constructor(idx: IDBIndex) {
    this.#index = idx;
  }

  get name(): string {
    return this.#index.name;
  }

  get keyPath(): string | string[] {
    return this.#index.keyPath;
  }

  get multiEntry(): boolean {
    return this.#index.multiEntry;
  }

  get unique(): boolean {
    return this.#index.unique;
  }

  count(query?: IDBValidKey | IDBKeyRange): Promise<number> {
    return promisifyRequest(this.#index.count(query));
  }

  get(query: IDBValidKey | IDBKeyRange): Promise<any> {
    return promisifyRequest(this.#index.get(query));
  }

  getAll(
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number,
  ): Promise<any[]> {
    return promisifyRequest(this.#index.getAll(query, count));
  }

  getAllKeys(
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number,
  ): Promise<IDBValidKey[]> {
    return promisifyRequest(this.#index.getAllKeys(query, count));
  }

  openCursor(
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,
  ): Promise<IDBCursorWithValue | null> {
    return promisifyRequest(this.#index.openCursor(query, direction));
  }

  openKeyCursor(
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,
  ): Promise<IDBCursor | null> {
    return promisifyRequest(this.#index.openKeyCursor(query, direction));
  }

  readAll<T>(
    parse: (key: IDBValidKey, value: any) => T | null,
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,
  ): Promise<T[]> {
    return readAll(parse, this.#index.openCursor(query, direction));
  }

  get [Symbol.toStringTag]() {
    return "DBIndex";
  }
}

function promisifyRequest<V>(request: IDBRequest): Promise<V> {
  return new Promise<V>((resolve, reject) => {
    request.onerror = (ev) => {
      console.error("IndexedDB request error", request.error);
      reject(request.error);
    };
    request.onsuccess = (ev) => {
      resolve(request.result as V);
    };
  });
}

function promisifyTransaction(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.onerror = (ev) => {
      console.error("IndexedDB transaction error", tx.error);
      reject(tx.error);
    };
    tx.onabort = (ev) => {
      reject(new AbortedError("Operation aborted"));
    };
    tx.oncomplete = (ev) => {
      resolve();
    };
  });
}

function readAll<T>(
  parse: (key: IDBValidKey, value: any) => T | null,
  request: IDBRequest<IDBCursorWithValue | null>,
): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    const result: T[] = [];

    request.onerror = (ev) => {
      reject(request.error);
    };

    request.onsuccess = (ev) => {
      const cursor = request.result;
      if (cursor != null) {
        const item = parse(cursor.key, cursor.value);
        if (item != null) {
          result.push(item);
        }
        cursor.continue();
      } else {
        resolve(result);
      }
    };
  });
}
