import { type Binder, type Module } from "@fastr/invert";
import Knex from "knex";
import { Env } from "./env.ts";
import { newKnex } from "./knex.ts";

export class ConfigModule implements Module {
  configure({ bind }: Binder): void {
    bind(Knex).toValue(newKnex());
    bind("dataDir").toValue(
      Env.getPath("DATA_DIR", "/var/lib/keybr"), //
    );
    bind("publicDir").toValue(
      Env.getPath("PUBLIC_DIR", "/opt/keybr/public"), //
    );
    bind("canonicalUrl").toValue(
      Env.getString("APP_URL", "https://www.keybr.com/"), //
    );
  }
}
