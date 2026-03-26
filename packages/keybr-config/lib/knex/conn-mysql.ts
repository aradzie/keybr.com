import { type Knex } from "knex";
import mysql from "knex/lib/dialects/mysql/index.js";
import { createConnection } from "mysql";
import { knexSnakeCaseMappers } from "objection";

export function connectMySql(config: Knex.MySqlConnectionConfig): Knex.Config {
  // We don't directly depend on the MySQL package,
  // so it won't be bundled by default. To ensure it is included,
  // we add an artificial direct dependency here.
  if (typeof createConnection !== "function") {
    throw new Error();
  }
  return {
    __client: "mysql",
    client: mysql,
    connection: { ...config, timezone: "UTC", charset: "UTF8" },
    useNullAsDefault: true,
    debug: Boolean(process.env.KNEX_DEBUG),
    ...knexSnakeCaseMappers(),
  } as Knex.Config;
}
