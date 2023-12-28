import Database from "better-sqlite3";
import { type Knex as KnexType } from "knex";
import sqlite from "knex/lib/dialects/better-sqlite3";
import { knexSnakeCaseMappers } from "objection";
import { fixTimestamps } from "./util.ts";

export function connectSqlite(
  config: KnexType.BetterSqlite3ConnectionConfig,
): KnexType.Config {
  bundleSqlitePackage();
  return {
    __client: "sqlite",
    client: sqlite,
    connection: { ...config },
    useNullAsDefault: true,
    debug: Boolean(process.env.KNEX_DEBUG),
    ...knexSnakeCaseMappers(),
    postProcessResponse: fixTimestamps,
  } as KnexType.Config;
}

function bundleSqlitePackage(): void {
  // We don't have any direct dependencies on the sqlite package.
  // If left as is then the sqlite package will not be bundled.
  // To fix this we need to introduce an artificial direct dependency,
  // so here is one.
  if (typeof Database !== "function") {
    throw new Error();
  }
}
