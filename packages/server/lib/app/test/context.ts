import { afterEach, beforeEach } from "node:test";
import { Container } from "@fastr/invert";
import { ConfigModule } from "@keybr/config";
import { useDatabase } from "@keybr/database/lib/testing.ts";
import { removeDir } from "@sosimple/fsx";
import { ServerModule } from "../../server/module.ts";
import { Mailer } from "../mail/index.ts";
import { ApplicationModule } from "../module.ts";
import { FakeMailer } from "./mail.ts";

export class TestContext extends Container {
  readonly mailer = new FakeMailer();

  constructor() {
    super();
    this.load(new ConfigModule());
    this.load(new ApplicationModule());
    this.load(new ServerModule());
    this.bind(Mailer).toValue(this.mailer); // Re-bind the mailer object.
    useDatabase();
    beforeEach(async () => {
      await removeDir(this.get("dataDir"));
    });
    afterEach(async () => {
      await removeDir(this.get("dataDir"));
    });
  }
}
