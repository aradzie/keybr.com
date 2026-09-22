import { type Knex } from "knex";
import { knexSnakeCaseMappers } from "objection";
import { Client_NodeSqlite } from "./node-sqlite.ts";
import { fixTimestamps } from "./util.ts";

export function connectSqlite(
  config: Knex.Sqlite3ConnectionConfig,
): Knex.Config {
  return {
    __client: "sqlite",
    client: Client_NodeSqlite,
    connection: { ...config },
    useNullAsDefault: true,
    debug: Boolean(process.env.KNEX_DEBUG),
    ...knexSnakeCaseMappers(),
    postProcessResponse: fixTimestamps,
  } as Knex.Config;
}
