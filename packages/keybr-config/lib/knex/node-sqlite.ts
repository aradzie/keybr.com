import {
  DatabaseSync,
  type SQLInputValue,
  type StatementResultingChanges,
} from "node:sqlite";
// The `sqlite3` dialect provides everything but the raw connection handling
// (query compiler, schema compiler, DDL, transactions), which is exactly
// what we need to reuse to drive a `node:sqlite` connection instead.
import Client_SQLite3 from "knex/lib/dialects/sqlite3/index.js";

// A knex client driving the built-in `node:sqlite` module, modelled after
// knex's own `better-sqlite3` dialect (both wrap a synchronous native
// driver), so that we don't need to depend on the third-party
// `better-sqlite3` package.
class Client_NodeSqlite extends Client_SQLite3 {
  _driver(): { DatabaseSync: typeof DatabaseSync } {
    return { DatabaseSync };
  }

  override async acquireRawConnection(): Promise<DatabaseSync> {
    const { filename } = this.connectionSettings as { filename: string };
    return new DatabaseSync(filename);
  }

  override async destroyRawConnection(connection: DatabaseSync): Promise<void> {
    connection.close();
  }

  async _query(connection: DatabaseSync, obj: any): Promise<any> {
    if (!obj.sql) {
      throw new Error("The query is empty");
    }
    if (!connection) {
      throw new Error("No connection provided");
    }

    const statement = connection.prepare(obj.sql);
    const bindings = formatBindings(obj.bindings);

    // `node:sqlite` has no equivalent of better-sqlite3's `statement.reader`
    // flag, but a statement that produces output columns is exactly a
    // statement whose result should be read with `.all()` instead of `.run()`.
    if (statement.columns().length > 0) {
      obj.response = statement.all(...bindings);
      return obj;
    }

    const response: StatementResultingChanges = statement.run(...bindings);
    obj.response = response;
    obj.context = {
      lastID: response.lastInsertRowid,
      changes: response.changes,
    };
    return obj;
  }
}

function formatBindings(
  bindings: readonly unknown[] | undefined,
): SQLInputValue[] {
  if (!bindings) {
    return [];
  }
  return bindings.map((binding): SQLInputValue => {
    if (binding instanceof Date) {
      return binding.valueOf();
    }
    if (typeof binding === "boolean") {
      return Number(binding);
    }
    // `node:sqlite` throws on `undefined`, unlike `better-sqlite3`.
    if (binding === undefined) {
      return null;
    }
    return binding as SQLInputValue;
  });
}

Object.assign(Client_NodeSqlite.prototype, {
  driverName: "node:sqlite",
});

export { Client_NodeSqlite };
