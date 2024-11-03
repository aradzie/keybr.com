import { test } from "node:test";
import { DataDir } from "@keybr/config";
import { Settings, stringProp } from "@keybr/settings";
import { removeDir } from "@sosimple/fsx";
import { File } from "@sosimple/fsx-file";
import { assert } from "chai";
import { SettingsDatabase } from "./index.ts";

const tmp = process.env.DATA_DIR ?? "/tmp/keybr";

test.beforeEach(async () => {
  await removeDir(tmp);
});

test.afterEach(async () => {
  await removeDir(tmp);
});

test("delete settings", async () => {
  // Arrange.

  const dataDir = new DataDir(tmp);
  const database = new SettingsDatabase(dataDir);
  const file = new File(dataDir.userSettingsFile(123));
  await file.write("something");

  // Act.

  await database.set(123, null);

  // Assert.

  assert.isFalse(await file.exists());
});

test("save new settings", async () => {
  // Arrange.

  const dataDir = new DataDir(tmp);
  const database = new SettingsDatabase(dataDir);
  const file = new File(dataDir.userSettingsFile(123));
  await file.delete();
  // Act.

  await database.set(123, new Settings().set(stringProp("prop", "abc"), "xyz"));

  // Assert.

  assert.deepStrictEqual(await file.readJson(), { prop: "xyz" });
});

test("update existing settings", async () => {
  // Arrange.

  const dataDir = new DataDir(tmp);
  const database = new SettingsDatabase(dataDir);
  const file = new File(dataDir.userSettingsFile(123));
  await file.write("something");
  // Act.

  await database.set(123, new Settings().set(stringProp("prop", "abc"), "xyz"));

  // Assert.

  assert.deepStrictEqual(await file.readJson(), { prop: "xyz" });
});

test("read missing settings", async () => {
  // Arrange.

  const dataDir = new DataDir(tmp);
  const database = new SettingsDatabase(dataDir);
  const file = new File(dataDir.userSettingsFile(123));
  await file.delete();

  // Act.

  const settings = await database.get(123);

  // Assert.

  assert.isNull(settings);
});

test("read existing settings", async () => {
  // Arrange.

  const dataDir = new DataDir(tmp);
  const database = new SettingsDatabase(dataDir);
  const file = new File(dataDir.userSettingsFile(123));
  await file.writeJson(
    new Settings().set(stringProp("prop", "abc"), "xyz").toJSON(),
  );

  // Act.

  const settings = await database.get(123);

  // Assert.

  assert.deepStrictEqual(settings?.toJSON(), { prop: "xyz" });
});
