import { type Knex } from "knex";
import sqlite from "knex/lib/dialects/better-sqlite3/index.js";
import { knexSnakeCaseMappers } from "objection";
import { fixTimestamps } from "./util.ts";

export function connectSqlite(
  config: Knex.BetterSqlite3ConnectionConfig,
): Knex.Config {
  return {
    __client: "sqlite",
    client: sqlite,
    connection: { ...config },
    useNullAsDefault: true,
    debug: Boolean(process.env.KNEX_DEBUG),
    ...knexSnakeCaseMappers(),
    postProcessResponse: fixTimestamps,
  } as Knex.Config;
}
