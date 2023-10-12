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
  private readonly _name: string;
  private readonly _version: number;
  private readonly _factory: DBFactory;

  constructor(factory: IDBFactory, name: string, version: number) {
    this._name = name;
    this._version = version;
    this._factory = new DBFactory(factory);
  }

  get name(): string {
    return this._name;
  }

  get version(): number {
    return this._version;
  }

  openDatabase(migration: Migration): Promise<DBDatabase> {
    return this._factory.openDatabase(this._name, this._version, migration);
  }

  deleteDatabase(): Promise<void> {
    return this._factory.deleteDatabase(this._name);
  }

  get [Symbol.toStringTag]() {
    return "DBNamedFactory";
  }
}

export class DBFactory {
  private readonly _factory: IDBFactory;

  constructor(factory: IDBFactory) {
    this._factory = factory;
  }

  openDatabase(
    name: string,
    version: number,
    migration: Migration,
  ): Promise<DBDatabase> {
    const request = this._factory.open(name, version);
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
    const request = this._factory.deleteDatabase(name);
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
  private readonly _db: IDBDatabase;

  constructor(db: IDBDatabase) {
    this._db = db;
  }

  get name(): string {
    return this._db.name;
  }

  get version(): number {
    return this._db.version;
  }

  get objectStoreNames(): string[] {
    return Array.from(this._db.objectStoreNames);
  }

  createObjectStore(
    name: string,
    options?: IDBObjectStoreParameters,
  ): DBObjectStore {
    return new DBObjectStore(this._db.createObjectStore(name, options));
  }

  deleteObjectStore(name: string): void {
    this._db.deleteObjectStore(name);
  }

  transaction(
    storeNames: string | string[],
    mode?: IDBTransactionMode,
    options?: IDBTransactionOptions,
  ): DBTransaction {
    return new DBTransaction(this._db.transaction(storeNames, mode, options));
  }

  close(): void {
    this._db.close();
  }

  get [Symbol.toStringTag]() {
    return "DBDatabase";
  }
}

export class DBTransaction {
  private readonly _tx: IDBTransaction;
  readonly completed: Promise<void>;

  constructor(tx: IDBTransaction) {
    this._tx = tx;
    this.completed = promisifyTransaction(tx);
  }

  get mode(): IDBTransactionMode {
    return this._tx.mode;
  }

  get durability(): IDBTransactionDurability {
    return this._tx.durability;
  }

  get error(): DOMException | null {
    return this._tx.error;
  }

  abort(): void {
    this._tx.abort();
  }

  commit(): void {
    this._tx.commit();
  }

  objectStore(name: string): DBObjectStore {
    return new DBObjectStore(this._tx.objectStore(name));
  }

  get [Symbol.toStringTag]() {
    return "DBTransaction";
  }
}

export class DBObjectStore {
  private readonly _store: IDBObjectStore;

  constructor(store: IDBObjectStore) {
    this._store = store;
  }

  get name(): string {
    return this._store.name;
  }

  get autoIncrement(): boolean {
    return this._store.autoIncrement;
  }

  get indexNames(): string[] {
    return Array.from(this._store.indexNames);
  }

  get keyPath(): string | string[] {
    return this._store.keyPath;
  }

  createIndex(
    name: string,
    keyPath: string | string[],
    options?: IDBIndexParameters,
  ): DBIndex {
    return new DBIndex(this._store.createIndex(name, keyPath, options));
  }

  deleteIndex(name: string): void {
    this._store.deleteIndex(name);
  }

  index(name: string): DBIndex {
    return new DBIndex(this._store.index(name));
  }

  count(key?: IDBValidKey | IDBKeyRange): Promise<number> {
    return promisifyRequest<number>(this._store.count(key));
  }

  get(key: IDBValidKey): Promise<any> {
    return promisifyRequest(this._store.get(key));
  }

  getAll(
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number,
  ): Promise<any[]> {
    return promisifyRequest(this._store.getAll(query, count));
  }

  getAllKeys(
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number,
  ): Promise<IDBValidKey[]> {
    return promisifyRequest(this._store.getAllKeys(query, count));
  }

  add(value: any, key?: IDBValidKey): Promise<IDBValidKey> {
    return promisifyRequest<IDBValidKey>(this._store.add(value, key));
  }

  put(value: any, key?: IDBValidKey): Promise<IDBValidKey> {
    return promisifyRequest<IDBValidKey>(this._store.put(value, key));
  }

  delete(key: IDBValidKey | IDBKeyRange): Promise<void> {
    return promisifyRequest<void>(this._store.delete(key));
  }

  clear(): Promise<void> {
    return promisifyRequest<void>(this._store.clear());
  }

  openCursor(
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,
  ): Promise<IDBCursorWithValue | null> {
    return promisifyRequest(this._store.openCursor(query, direction));
  }

  openKeyCursor(
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,
  ): Promise<IDBCursor | null> {
    return promisifyRequest(this._store.openKeyCursor(query, direction));
  }

  readAll<T>(
    parse: (key: IDBValidKey, value: any) => T | null,
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,
  ): Promise<T[]> {
    return readAll(parse, this._store.openCursor(query, direction));
  }

  get [Symbol.toStringTag]() {
    return "DBObjectStore";
  }
}

export class DBIndex {
  private readonly _index: IDBIndex;

  constructor(idx: IDBIndex) {
    this._index = idx;
  }

  get name(): string {
    return this._index.name;
  }

  get keyPath(): string | string[] {
    return this._index.keyPath;
  }

  get multiEntry(): boolean {
    return this._index.multiEntry;
  }

  get unique(): boolean {
    return this._index.unique;
  }

  count(query?: IDBValidKey | IDBKeyRange): Promise<number> {
    return promisifyRequest(this._index.count(query));
  }

  get(query: IDBValidKey | IDBKeyRange): Promise<any> {
    return promisifyRequest(this._index.get(query));
  }

  getAll(
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number,
  ): Promise<any[]> {
    return promisifyRequest(this._index.getAll(query, count));
  }

  getAllKeys(
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number,
  ): Promise<IDBValidKey[]> {
    return promisifyRequest(this._index.getAllKeys(query, count));
  }

  openCursor(
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,
  ): Promise<IDBCursorWithValue | null> {
    return promisifyRequest(this._index.openCursor(query, direction));
  }

  openKeyCursor(
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,
  ): Promise<IDBCursor | null> {
    return promisifyRequest(this._index.openKeyCursor(query, direction));
  }

  readAll<T>(
    parse: (key: IDBValidKey, value: any) => T | null,
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,
  ): Promise<T[]> {
    return readAll(parse, this._index.openCursor(query, direction));
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
