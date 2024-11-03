import { join } from "node:path";
import { test } from "node:test";
import { ResultFaker } from "@keybr/result";
import { exists, removeDir } from "@sosimple/fsx";
import { File } from "@sosimple/fsx-file";
import { assert } from "chai";
import { fixFile } from "./fix-file.ts";

const tmp = process.env.DATA_DIR ?? "/tmp/keybr";

test.beforeEach(async () => {
  await removeDir(tmp);
});

test.afterEach(async () => {
  await removeDir(tmp);
});

const faker = new ResultFaker();
const r0 = faker.nextResult();
const r1 = faker.nextResult();
const r2 = faker.nextResult();

test("fix empty file", async () => {
  // Arrange.

  const name = join(tmp, "000");
  const file = new File(name);
  await file.write(Buffer.from("dummy"));

  // Act.

  await fixFile(file, []);

  // Assert.

  assert.isTrue(await exists(name + "~corrupted"));
  assert.isFalse(await exists(name));
});

test("fix non-empty file", async () => {
  // Arrange.

  const name = join(tmp, "000");
  const file = new File(name);
  await file.write(Buffer.from("dummy"));

  // Act.

  await fixFile(file, [r0, r1, r2]);

  // Assert.

  assert.isTrue(await exists(name + "~corrupted"));
  assert.isTrue(await exists(name));
});
