import { request } from "@fastr/client";
import { start } from "@fastr/client-testlib";
import { Application } from "@fastr/core";
import { DataDir } from "@keybr/config";
import { PublicId } from "@keybr/publicid";
import { type Result, ResultFaker } from "@keybr/result";
import { exists, removeDir, touch } from "@sosimple/fsx";
import test from "ava";
import { type UserData, UserDataFactory } from "./index.ts";

const testDataDir = process.env.DATA_DIR ?? "/tmp/keybr";

test.beforeEach(async () => {
  await removeDir(testDataDir);
});

test.afterEach(async () => {
  await removeDir(testDataDir);
});

test.serial("handle missing data file", async (t) => {
  // Arrange.

  const id = new PublicId(1);
  const factory = new UserDataFactory(new DataDir(testDataDir));
  const userData = factory.load(id);

  // Assert.

  t.false(await userData.exists());
  t.deepEqual(await readAll(userData), []);
});

test.serial("append new results", async (t) => {
  // Arrange.

  const id = new PublicId(1);
  const factory = new UserDataFactory(new DataDir(testDataDir));
  const userData = factory.load(id);
  const faker = new ResultFaker();
  const results = [faker.nextResult(), faker.nextResult(), faker.nextResult()];

  // Act.

  await userData.append([]);

  // Assert.

  t.false(await userData.exists());
  t.deepEqual(await readAll(userData), []);

  // Act.

  await userData.append(results);

  // Assert.

  t.true(await userData.exists());
  t.deepEqual(await readAll(userData), results);
});

test.serial("delete missing file", async (t) => {
  // Arrange.

  const id = new PublicId(1);
  const factory = new UserDataFactory(new DataDir(testDataDir));
  const name = factory.getFile(id).name;
  const userData = factory.load(id);

  // Assert.

  t.false(await userData.exists());
  t.deepEqual(await readAll(userData), []);
  t.false(await exists(name + "~1"));

  // Act.

  await userData.delete();

  // Assert.

  t.false(await userData.exists());
  t.deepEqual(await readAll(userData), []);
  t.false(await exists(name + "~1"));
});

test.serial("delete existing file", async (t) => {
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

  t.true(await userData.exists());
  t.deepEqual(await readAll(userData), results);
  t.false(await exists(name + "~1"));

  // Act.

  await userData.delete();

  // Assert.

  t.false(await userData.exists());
  t.deepEqual(await readAll(userData), []);
  t.true(await exists(name + "~1"));
});

test.serial("delete existing file second time", async (t) => {
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

  t.true(await userData.exists());
  t.deepEqual(await readAll(userData), results);
  t.false(await exists(name + "~3"));

  // Act.

  await userData.delete();

  // Assert.

  t.false(await userData.exists());
  t.deepEqual(await readAll(userData), []);
  t.true(await exists(name + "~3"));
});

test.serial("serve", async (t) => {
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

    t.is(status, 200);
    t.is(headers.get("Content-Type"), "application/octet-stream");
    t.is(headers.get("Content-Length"), "0");
    t.is(headers.get("Content-Encoding"), null);
    t.is(
      headers.get("Content-Disposition"),
      'attachment; filename="stats.data"',
    );
    t.is(headers.get("Cache-Control"), "private, no-cache");
    t.is(headers.get("Last-Modified"), null);
    etag1 = headers.get("ETag")!;
    t.regex(etag1, /"[a-zA-Z0-9]+"/);
    t.is((await body.buffer()).length, 0);
  }

  {
    // Act.

    await userData.append([faker.nextResult()]);

    // Assert.

    const { status, headers, body } = await req.GET("/").send();

    t.is(status, 200);
    t.is(headers.get("Content-Type"), "application/octet-stream");
    t.is(headers.get("Content-Length"), "70");
    t.is(headers.get("Content-Encoding"), null);
    t.is(
      headers.get("Content-Disposition"),
      'attachment; filename="stats.data"',
    );
    t.is(headers.get("Cache-Control"), "private, no-cache");
    t.is(headers.get("Last-Modified"), null);
    etag2 = headers.get("ETag")!;
    t.regex(etag2, /"[a-zA-Z0-9]+"/);
    t.is((await body.buffer()).length, 70);
  }

  t.not(etag1, etag2);
});

async function readAll(userData: UserData): Promise<readonly Result[]> {
  const results = [];
  for await (const result of userData.read()) {
    results.push(result);
  }
  return results;
}
