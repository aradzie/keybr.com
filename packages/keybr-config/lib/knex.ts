import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Knex, { type Knex as KnexType } from "knex";
import { Model } from "objection";
import { Env } from "./env.ts";
import { connectMySql } from "./knex/conn-mysql.ts";
import { connectSqlite } from "./knex/conn-sqlite.ts";

export function newKnex(): KnexType {
  const knex = Knex(connect());
  Model.knex(knex);
  return knex;
}

function connect(): KnexType.Config {
  const client = Env.getString("DATABASE_CLIENT", "mysql");
  switch (client) {
    case "mysql": {
      const host = Env.getString("DATABASE_HOST", "localhost");
      const port = Env.getNumber("DATABASE_PORT", 3306);
      const database = Env.getString("DATABASE_DATABASE", "keybr");
      const user = Env.getString("DATABASE_USERNAME", "keybr") || undefined;
      const password = Env.getString("DATABASE_PASSWORD", "") || undefined;
      return connectMySql({ host, port, database, user, password });
    }
    case "sqlite": {
      let filename = Env.getString("DATABASE_FILENAME", ":memory:");
      if (filename !== ":memory:") {
        filename = Env.asPath(filename);
        mkdirSync(dirname(filename), { recursive: true });
      }
      return connectSqlite({ filename });
    }
    default:
      throw new TypeError(`Unsupported database client [${client}]`);
  }
}
