import { type Result } from "@keybr/result";
import { resultFromJson, resultToJson } from "@keybr/result-io";
import {
  type DBDatabase,
  DBNamedFactory,
  type DBTransaction,
} from "./indexeddb/index.ts";
import { type LocalResultStorage } from "./types.ts";

export class PersistentResultStorage implements LocalResultStorage {
  readonly #factory = new DBNamedFactory(indexedDB, "history", 1);

  async load(): Promise<Result[]> {
    const db = await this.#factory.openDatabase(migration);
    try {
      const tx = db.transaction(db.name, "readonly");
      const store = tx.objectStore(db.name);
      const results = await store.readAll((key, value) => {
        return resultFromJson(value);
      });
      await tx.completed;
      return results;
    } finally {
      db.close();
    }
  }

  async append(results: readonly Result[]): Promise<void> {
    const db = await this.#factory.openDatabase(migration);
    try {
      const tx = db.transaction(db.name, "readwrite");
      const store = tx.objectStore(db.name);
      for (const result of results) {
        await store.add(resultToJson(result));
      }
      await tx.completed;
    } finally {
      db.close();
    }
  }

  async clear(): Promise<void> {
    return await this.#factory.deleteDatabase();
  }
}

async function migration(
  db: DBDatabase,
  tx: DBTransaction,
  oldVersion: number,
  newVersion: number | null,
): Promise<void> {
  db.createObjectStore(db.name, { autoIncrement: true });
}
