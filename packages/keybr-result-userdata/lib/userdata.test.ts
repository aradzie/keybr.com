import { createServer } from "node:http";
import { after, test } from "node:test";
import { request } from "@fastr/client";
import { start } from "@fastr/client-testlib";
import { Application } from "@fastr/core";
import { DataDir } from "@keybr/config";
import { PublicId } from "@keybr/publicid";
import { ResultFaker } from "@keybr/result";
import { exists, removeDir, touch } from "@sosimple/fsx";
import {
  deepEqual,
  equal,
  isFalse,
  isTrue,
  match,
  notEqual,
} from "rich-assert";
import { type UserData, UserDataFactory } from "./index.ts";

const tmp = process.env.DATA_DIR ?? "/tmp/keybr";

test.beforeEach(async () => {
  await removeDir(tmp);
});

test.afterEach(async () => {
  await removeDir(tmp);
});

test("handle missing data file", async () => {
  // Arrange.

  const id = new PublicId(1);
  const factory = new UserDataFactory(new DataDir(tmp));
  const userData = factory.load(id);

  // Assert.

  isFalse(await userData.exists());
  deepEqual(await readAll(userData), []);
});

test("append new results", async () => {
  // Arrange.

  const id = new PublicId(1);
  const factory = new UserDataFactory(new DataDir(tmp));
  const userData = factory.load(id);
  const faker = new ResultFaker();
  const results = [faker.nextResult(), faker.nextResult(), faker.nextResult()];

  // Act.

  await userData.append([]);

  // Assert.

  isFalse(await userData.exists());
  deepEqual(await readAll(userData), []);

  // Act.

  await userData.append(results);

  // Assert.

  isTrue(await userData.exists());
  deepEqual(await readAll(userData), results);
});

test("delete missing file", async () => {
  // Arrange.

  const id = new PublicId(1);
  const factory = new UserDataFactory(new DataDir(tmp));
  const name = factory.getFile(id).name;
  const userData = factory.load(id);

  // Assert.

  isFalse(await userData.exists());
  deepEqual(await readAll(userData), []);
  isFalse(await exists(name + "~1"));

  // Act.

  await userData.delete();

  // Assert.

  isFalse(await userData.exists());
  deepEqual(await readAll(userData), []);
  isFalse(await exists(name + "~1"));
});

test("delete existing file", async () => {
  // Arrange.

  const id = new PublicId(1);
  const factory = new UserDataFactory(new DataDir(tmp));
  const name = factory.getFile(id).name;
  const userData = factory.load(id);
  const faker = new ResultFaker();
  const results = [faker.nextResult(), faker.nextResult(), faker.nextResult()];

  // Act.

  await userData.append(results);

  // Assert.

  isTrue(await userData.exists());
  deepEqual(await readAll(userData), results);
  isFalse(await exists(name + "~1"));

  // Act.

  await userData.delete();

  // Assert.

  isFalse(await userData.exists());
  deepEqual(await readAll(userData), []);
  isTrue(await exists(name + "~1"));
});

test("delete existing file second time", async () => {
  // Arrange.

  const id = new PublicId(1);
  const factory = new UserDataFactory(new DataDir(tmp));
  const name = factory.getFile(id).name;
  const userData = factory.load(id);
  const faker = new ResultFaker();
  const results = [faker.nextResult(), faker.nextResult(), faker.nextResult()];
  await touch(name + "~1");
  await touch(name + "~2");

  // Act.

  await userData.append(results);

  // Assert.

  isTrue(await userData.exists());
  deepEqual(await readAll(userData), results);
  isFalse(await exists(name + "~3"));

  // Act.

  await userData.delete();

  // Assert.

  isFalse(await userData.exists());
  deepEqual(await readAll(userData), []);
  isTrue(await exists(name + "~3"));
});

test("serve", async () => {
  // Arrange.

  const id = new PublicId(1);
  const factory = new UserDataFactory(new DataDir(tmp));
  const userData = factory.load(id);
  const app = new Application();
  app.use(async (ctx) => {
    await userData.serve(ctx);
  });
  const req = request.use(start(createTestServer(app.callback())));
  const faker = new ResultFaker();

  let etag1;
  let etag2;

  {
    // Act.

    const { status, headers, body } = await req.GET("/").send();

    // Assert.

    equal(status, 200);
    equal(headers.get("Content-Type"), "application/octet-stream");
    equal(headers.get("Content-Length"), "0");
    equal(headers.get("Content-Encoding"), null);
    equal(
      headers.get("Content-Disposition"),
      'attachment; filename="stats.data"',
    );
    equal(headers.get("Cache-Control"), "private, no-cache");
    equal(headers.get("Last-Modified"), null);
    equal((await body.buffer()).length, 0);
    etag1 = headers.get("ETag")!;
  }

  {
    // Act.

    await userData.append([faker.nextResult()]);

    const { status, headers, body } = await req.GET("/").send();

    // Assert.

    equal(status, 200);
    equal(headers.get("Content-Type"), "application/octet-stream");
    equal(headers.get("Content-Length"), "70");
    equal(headers.get("Content-Encoding"), null);
    equal(
      headers.get("Content-Disposition"),
      'attachment; filename="stats.data"',
    );
    equal(headers.get("Cache-Control"), "private, no-cache");
    equal(headers.get("Last-Modified"), null);
    equal((await body.buffer()).length, 70);
    etag2 = headers.get("ETag")!;
  }

  match(etag1, /"[a-zA-Z0-9]+"/);
  match(etag2, /"[a-zA-Z0-9]+"/);
  notEqual(etag1, etag2);
});

async function readAll(userData: UserData) {
  const results = [];
  for await (const result of userData.read()) {
    results.push(result);
  }
  return results;
}

function createTestServer(callback: any) {
  const server = createServer(callback);
  after(() => {
    server.close();
  });
  return server;
}
