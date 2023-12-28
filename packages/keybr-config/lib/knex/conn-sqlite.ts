import type Database from "better-sqlite3";
import { type Knex as KnexType } from "knex";
import sqlite from "knex/lib/dialects/better-sqlite3";
import { knexSnakeCaseMappers } from "objection";
import { fixTimestamps } from "./util.ts";

export function connectSqlite(
  config: KnexType.BetterSqlite3ConnectionConfig,
): KnexType.Config {
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

function dummy(db: Database): void {
  // Disable the unused dependency lint error.
}
