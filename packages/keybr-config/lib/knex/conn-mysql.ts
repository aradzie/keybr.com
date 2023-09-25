import { type Knex as KnexType } from "knex";
import mysql from "knex/lib/dialects/mysql";
import { createConnection } from "mysql";
import { knexSnakeCaseMappers } from "objection";

export function connectMySql(
  config: KnexType.MySqlConnectionConfig,
): KnexType.Config {
  bundleMySqlPackage();
  return {
    __client: "mysql",
    client: mysql,
    connection: { ...config, timezone: "UTC", charset: "UTF8" },
    useNullAsDefault: true,
    debug: Boolean(process.env.KNEX_DEBUG),
    ...knexSnakeCaseMappers(),
  } as KnexType.Config;
}

function bundleMySqlPackage(): void {
  // We don't have any direct dependencies on the MySQL package.
  // If left as is then the MySQL package will not be bundled.
  // To fix this we need to introduce an artificial direct dependency,
  // so here is one.
  if (typeof createConnection !== "function") {
    throw new Error();
  }
}
