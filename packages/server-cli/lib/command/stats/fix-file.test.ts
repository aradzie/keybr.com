import { join } from "node:path";
import { ResultFaker } from "@keybr/result";
import { exists, removeDir } from "@sosimple/fsx";
import { File } from "@sosimple/fsx-file";
import test from "ava";
import { fixFile } from "./fix-file.ts";

const testDataDir = process.env.DATA_DIR ?? "/tmp/keybr";

test.beforeEach(async () => {
  await removeDir(testDataDir);
});

test.afterEach(async () => {
  await removeDir(testDataDir);
});

const faker = new ResultFaker();
const r0 = faker.nextResult();
const r1 = faker.nextResult();
const r2 = faker.nextResult();

test.serial("fix empty file", async (t) => {
  // Arrange.

  const name = join(testDataDir, "000");
  const file = new File(name);
  await file.write(Buffer.from("dummy"));

  // Act.

  await fixFile(file, []);

  // Assert.

  t.true(await exists(name + "~corrupted"));
  t.false(await exists(name));
});

test.serial("fix non-empty file", async (t) => {
  // Arrange.

  const name = join(testDataDir, "000");
  const file = new File(name);
  await file.write(Buffer.from("dummy"));

  // Act.

  await fixFile(file, [r0, r1, r2]);

  // Assert.

  t.true(await exists(name + "~corrupted"));
  t.true(await exists(name));
});
