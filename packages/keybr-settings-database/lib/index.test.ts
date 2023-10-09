import { DataDir } from "@keybr/config";
import { Settings, stringProp } from "@keybr/settings";
import { removeDir } from "@sosimple/fsx";
import { File } from "@sosimple/fsx-file";
import test from "ava";
import { SettingsDatabase } from "./index.ts";

const testDataDir = process.env.DATA_DIR ?? "/tmp/keybr";

test.beforeEach(async () => {
  await removeDir(testDataDir);
});

test.afterEach(async () => {
  await removeDir(testDataDir);
});

test.serial("delete settings", async (t) => {
  // Arrange.

  const dataDir = new DataDir(testDataDir);
  const database = new SettingsDatabase(dataDir);
  const file = new File(dataDir.userSettingsFile(123));
  await file.write("something");

  // Act.

  await database.set(123, null);

  // Assert.

  t.false(await file.exists());
});

test.serial("save new settings", async (t) => {
  // Arrange.

  const dataDir = new DataDir(testDataDir);
  const database = new SettingsDatabase(dataDir);
  const file = new File(dataDir.userSettingsFile(123));
  await file.delete();
  // Act.

  await database.set(123, new Settings().set(stringProp("prop", "abc"), "xyz"));

  // Assert.

  t.like(await file.readJson(), { prop: "xyz" });
});

test.serial("update existing settings", async (t) => {
  // Arrange.

  const dataDir = new DataDir(testDataDir);
  const database = new SettingsDatabase(dataDir);
  const file = new File(dataDir.userSettingsFile(123));
  await file.write("something");
  // Act.

  await database.set(123, new Settings().set(stringProp("prop", "abc"), "xyz"));

  // Assert.

  t.like(await file.readJson(), { prop: "xyz" });
});

test.serial("read missing settings", async (t) => {
  // Arrange.

  const dataDir = new DataDir(testDataDir);
  const database = new SettingsDatabase(dataDir);
  const file = new File(dataDir.userSettingsFile(123));
  await file.delete();

  // Act.

  const settings = await database.get(123);

  // Assert.

  t.is(settings, null);
});

test.serial("read existing settings", async (t) => {
  // Arrange.

  const dataDir = new DataDir(testDataDir);
  const database = new SettingsDatabase(dataDir);
  const file = new File(dataDir.userSettingsFile(123));
  await file.writeJson(
    new Settings().set(stringProp("prop", "abc"), "xyz").toJSON(),
  );

  // Act.

  const settings = await database.get(123);

  // Assert.

  t.like(settings?.toJSON(), { prop: "xyz" });
});
