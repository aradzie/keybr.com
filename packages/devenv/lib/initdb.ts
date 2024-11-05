#!/usr/bin/env -S npx tsnode

import { Container } from "@fastr/invert";
import { ConfigModule, Env } from "@keybr/config";
import { createSchema, UserLoginRequest } from "@keybr/database";
import { Logger } from "@keybr/logger";
import Knex from "knex";

const email = "user@localhost";
const accessToken = "xyz";

Env.probeFilesSync();
const container = new Container();
container.load(new ConfigModule());
const knex = container.get(Knex);

async function exec() {
  try {
    await createSchema(knex);
    Logger.info(`Database schema was created.`);
    await UserLoginRequest.query().delete().where({ email });
    await UserLoginRequest.query().insert({ email, accessToken });
    const loginLink = new URL(
      `/login/${accessToken}`,
      container.get("canonicalUrl"),
    );
    Logger.info(`Access token '${accessToken}' was created.`);
    Logger.info(`Visit ${loginLink} to login with an example account.`);
  } finally {
    await knex.destroy();
  }
}

exec().catch((err) => {
  console.error(err);
});
