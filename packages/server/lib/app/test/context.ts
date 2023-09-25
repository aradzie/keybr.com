import { Container } from "@fastr/invert";
import { ConfigModule } from "@keybr/config";
import { createSchema } from "@keybr/database";
import { clearTables, seedModels } from "@keybr/database/lib/testing/seeds.ts";
import { removeDir } from "@sosimple/fsx";
import baseTest, { type TestFn } from "ava"; // eslint-disable-line
import Knex from "knex";
import { ServerModule } from "../../server/module.ts";
import { Mailer } from "../mail/index.ts";
import { ApplicationModule } from "../module.ts";
import { FakeMailer } from "./mail.ts";

export const test = baseTest as TestFn<Context>;

test.beforeEach(async (t) => {
  t.context = new Context();
});

test.beforeEach(async (t) => {
  await createSchema(t.context.get(Knex));
  await clearTables();
  await seedModels();
});

test.beforeEach(async (t) => {
  await removeDir(t.context.get("dataDir"));
});

test.afterEach(async (t) => {
  await removeDir(t.context.get("dataDir"));
});

export class Context extends Container {
  readonly mailer = new FakeMailer();

  constructor() {
    super();

    this.load(new ConfigModule());
    this.load(new ApplicationModule());
    this.load(new ServerModule());
    this.bind(Mailer).toValue(this.mailer); // Re-bind the mailer object.
  }
}
