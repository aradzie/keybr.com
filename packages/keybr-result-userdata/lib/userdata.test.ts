import { test } from "node:test";
import { request } from "@fastr/client";
import { start } from "@fastr/client-testlib";
import { Application } from "@fastr/core";
import { DataDir } from "@keybr/config";
import { PublicId } from "@keybr/publicid";
import { type Result, ResultFaker } from "@keybr/result";
import { exists, removeDir, touch } from "@sosimple/fsx";
import { assert } from "chai";
import { type UserData, UserDataFactory } from "./index.ts";

const testDataDir = process.env.DATA_DIR ?? "/tmp/keybr";

test.beforeEach(async () => {
  await removeDir(testDataDir);
});

test.afterEach(async () => {
  await removeDir(testDataDir);
});

test.after(() => {
  process.exit();
});

test("handle missing data file", async () => {
  // Arrange.

  const id = new PublicId(1);
  const factory = new UserDataFactory(new DataDir(testDataDir));
  const userData = factory.load(id);

  // Assert.

  assert.isFalse(await userData.exists());
  assert.deepStrictEqual(await readAll(userData), []);
});

test("append new results", async () => {
  // Arrange.

  const id = new PublicId(1);
  const factory = new UserDataFactory(new DataDir(testDataDir));
  const userData = factory.load(id);
  const faker = new ResultFaker();
  const results = [faker.nextResult(), faker.nextResult(), faker.nextResult()];

  // Act.

  await userData.append([]);

  // Assert.

  assert.isFalse(await userData.exists());
  assert.deepStrictEqual(await readAll(userData), []);

  // Act.

  await userData.append(results);

  // Assert.

  assert.isTrue(await userData.exists());
  assert.deepStrictEqual(await readAll(userData), results);
});

test("delete missing file", async () => {
  // Arrange.

  const id = new PublicId(1);
  const factory = new UserDataFactory(new DataDir(testDataDir));
  const name = factory.getFile(id).name;
  const userData = factory.load(id);

  // Assert.

  assert.isFalse(await userData.exists());
  assert.deepStrictEqual(await readAll(userData), []);
  assert.isFalse(await exists(name + "~1"));

  // Act.

  await userData.delete();

  // Assert.

  assert.isFalse(await userData.exists());
  assert.deepStrictEqual(await readAll(userData), []);
  assert.isFalse(await exists(name + "~1"));
});

test("delete existing file", async () => {
  // Arrange.

  const id = new PublicId(1);
  const factory = new UserDataFactory(new DataDir(testDataDir));
  const name = factory.getFile(id).name;
  const userData = factory.load(id);
  const faker = new ResultFaker();
  const results = [faker.nextResult(), faker.nextResult(), faker.nextResult()];

  // Act.

  await userData.append(results);

  // Assert.

  assert.isTrue(await userData.exists());
  assert.deepStrictEqual(await readAll(userData), results);
  assert.isFalse(await exists(name + "~1"));

  // Act.

  await userData.delete();

  // Assert.

  assert.isFalse(await userData.exists());
  assert.deepStrictEqual(await readAll(userData), []);
  assert.isTrue(await exists(name + "~1"));
});

test("delete existing file second time", async () => {
  // Arrange.

  const id = new PublicId(1);
  const factory = new UserDataFactory(new DataDir(testDataDir));
  const name = factory.getFile(id).name;
  const userData = factory.load(id);
  const faker = new ResultFaker();
  const results = [faker.nextResult(), faker.nextResult(), faker.nextResult()];
  await touch(name + "~1");
  await touch(name + "~2");

  // Act.

  await userData.append(results);

  // Assert.

  assert.isTrue(await userData.exists());
  assert.deepStrictEqual(await readAll(userData), results);
  assert.isFalse(await exists(name + "~3"));

  // Act.

  await userData.delete();

  // Assert.

  assert.isFalse(await userData.exists());
  assert.deepStrictEqual(await readAll(userData), []);
  assert.isTrue(await exists(name + "~3"));
});

test("serve", async () => {
  // Arrange.

  const id = new PublicId(1);
  const factory = new UserDataFactory(new DataDir(testDataDir));
  const userData = factory.load(id);
  const app = new Application();
  app.use(async (ctx) => {
    await userData.serve(ctx);
  });
  const req = request.use(start(app.callback()));
  const faker = new ResultFaker();

  let etag1: string;
  let etag2: string;

  {
    // Act.

    const { status, headers, body } = await req.GET("/").send();

    // Assert.

    assert.strictEqual(status, 200);
    assert.strictEqual(headers.get("Content-Type"), "application/octet-stream");
    assert.strictEqual(headers.get("Content-Length"), "0");
    assert.strictEqual(headers.get("Content-Encoding"), null);
    assert.strictEqual(
      headers.get("Content-Disposition"),
      'attachment; filename="stats.data"',
    );
    assert.strictEqual(headers.get("Cache-Control"), "private, no-cache");
    assert.strictEqual(headers.get("Last-Modified"), null);
    etag1 = headers.get("ETag")!;
    assert.match(etag1, /"[a-zA-Z0-9]+"/);
    assert.strictEqual((await body.buffer()).length, 0);
  }

  {
    // Act.

    await userData.append([faker.nextResult()]);

    // Assert.

    const { status, headers, body } = await req.GET("/").send();

    assert.strictEqual(status, 200);
    assert.strictEqual(headers.get("Content-Type"), "application/octet-stream");
    assert.strictEqual(headers.get("Content-Length"), "70");
    assert.strictEqual(headers.get("Content-Encoding"), null);
    assert.strictEqual(
      headers.get("Content-Disposition"),
      'attachment; filename="stats.data"',
    );
    assert.strictEqual(headers.get("Cache-Control"), "private, no-cache");
    assert.strictEqual(headers.get("Last-Modified"), null);
    etag2 = headers.get("ETag")!;
    assert.match(etag2, /"[a-zA-Z0-9]+"/);
    assert.strictEqual((await body.buffer()).length, 70);
  }

  assert.notStrictEqual(etag1, etag2);
});

async function readAll(userData: UserData): Promise<readonly Result[]> {
  const results = [];
  for await (const result of userData.read()) {
    results.push(result);
  }
  return results;
}
