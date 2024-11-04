import { test } from "node:test";
import { Application } from "@fastr/core";
import { PublicId } from "@keybr/publicid";
import { ResultFaker } from "@keybr/result";
import { formatMessage } from "@keybr/result-io";
import { UserDataFactory } from "@keybr/result-userdata";
import { assert } from "chai";
import { kMain } from "../module.ts";
import { TestContext } from "../test/context.ts";
import { startApp } from "../test/request.ts";
import { findUser } from "../test/sql.ts";

const now = new Date("2001-02-03T04:05:06Z");

const faker = new ResultFaker({ timeStamp: now.getTime() });
const invalidBody = formatMessage([faker.nextResult({ length: 0, time: 0 })]);
const validBody = formatMessage([faker.nextResult()]);
const garbageBody = Buffer.from("garbage");

const context = new TestContext();

test("handle unauthenticated user", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const request = startApp(context.get(Application, kMain));

  // Assert.

  assert.strictEqual((await request.GET("/_/sync/data").send()).status, 403);
  assert.strictEqual(
    (await request.POST("/_/sync/data").send(validBody)).status,
    403,
  );
  assert.strictEqual((await request.DELETE("/_/sync/data").send()).status, 403);
});

test("get public user data", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const factory = context.get(UserDataFactory);
  const user = await findUser("user1@keybr.com");
  const id = new PublicId(user.id!);
  const userData = factory.load(id);
  await userData.append([faker.nextResult()]);

  const request = startApp(context.get(Application, kMain));

  // Act.

  const response = await request.GET("/_/sync/data/" + id).send();

  // Assert.

  assert.strictEqual(response.status, 200);
  assert.strictEqual(
    response.headers.get("Content-Type"),
    "application/octet-stream",
  );
  assert.match(response.headers.get("Content-Length")!, /\d+/);
  assert.strictEqual(response.headers.get("Content-Encoding"), null);
  assert.strictEqual(
    response.headers.get("Cache-Control"),
    "private, no-cache",
  );
  assert.match(response.headers.get("ETag")!, /"[a-z0-9]+"/);
  assert.isTrue((await response.body.buffer()).length > 0);
});

test("get empty user data", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const factory = context.get(UserDataFactory);
  const user = await findUser("user1@keybr.com");
  const userData = factory.load(new PublicId(user.id!));
  await userData.delete();

  const request = startApp(context.get(Application, kMain));

  await request.become(user.id!);

  // Act.

  const response = await request.GET("/_/sync/data").send();

  // Assert.

  assert.strictEqual(response.status, 200);
  assert.strictEqual(
    response.headers.get("Content-Type"),
    "application/octet-stream",
  );
  assert.strictEqual(response.headers.get("Content-Length"), "0");
  assert.strictEqual(response.headers.get("Content-Encoding"), null);
  assert.strictEqual(
    response.headers.get("Cache-Control"),
    "private, no-cache",
  );
  assert.match(response.headers.get("ETag")!, /"[a-z0-9]+"/);
  assert.strictEqual((await response.body.buffer()).length, 0);
});

test("get existing user data", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const factory = context.get(UserDataFactory);
  const user = await findUser("user1@keybr.com");
  const userData = factory.load(new PublicId(user.id!));
  await userData.append([faker.nextResult()]);

  const request = startApp(context.get(Application, kMain));

  await request.become(user.id!);

  // Act.

  const response = await request.GET("/_/sync/data").send();

  // Assert.

  assert.strictEqual(response.status, 200);
  assert.strictEqual(
    response.headers.get("Content-Type"),
    "application/octet-stream",
  );
  assert.strictEqual(response.headers.get("Content-Length"), "70");
  assert.strictEqual(response.headers.get("Content-Encoding"), null);
  assert.strictEqual(
    response.headers.get("Cache-Control"),
    "private, no-cache",
  );
  assert.match(response.headers.get("ETag")!, /"[a-z0-9]+"/);
  assert.strictEqual((await response.body.buffer()).length, 70);
});

test("validate content type on post", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const request = startApp(context.get(Application, kMain));

  await request.become("user1@keybr.com");

  // Act.

  const response = await request
    .POST("/_/sync/data")
    .type("text/plain")
    .send(validBody);

  // Assert.

  assert.strictEqual(response.status, 415);
});

test("validate format on post", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const request = startApp(context.get(Application, kMain));

  await request.become("user1@keybr.com");

  // Act.

  const response = await request.POST("/_/sync/data").send(garbageBody);

  // Assert.

  assert.strictEqual(response.status, 400);
});

test("validate data on post", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const factory = context.get(UserDataFactory);
  const user = await findUser("user1@keybr.com");
  const userData = factory.load(new PublicId(user.id!));
  await userData.delete();

  const request = startApp(context.get(Application, kMain));

  await request.become("user1@keybr.com");

  // Act.

  const response = await request.POST("/_/sync/data").send(invalidBody);

  // Assert.

  assert.strictEqual(response.status, 204);

  assert.isFalse(await userData.exists());
});

test("post to user data", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const factory = context.get(UserDataFactory);
  const user = await findUser("user1@keybr.com");
  const userData = factory.load(new PublicId(user.id!));
  await userData.delete();

  const request = startApp(context.get(Application, kMain));

  await request.become(user.id!);

  // Act.

  const response = await request.POST("/_/sync/data").send(validBody);

  // Assert.

  assert.strictEqual(response.status, 204);

  assert.isTrue(await userData.exists());
});

test("delete empty user data", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const factory = context.get(UserDataFactory);
  const user = await findUser("user1@keybr.com");
  const userData = factory.load(new PublicId(user.id!));
  await userData.delete();

  const request = startApp(context.get(Application, kMain));

  await request.become(user.id!);

  // Act, Assert.

  assert.isFalse(await userData.exists());

  assert.strictEqual(
    (
      await request //
        .DELETE("/_/sync/data")
        .send()
    ).status,
    204,
  );

  assert.isFalse(await userData.exists());
});

test("delete existing user data", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const factory = context.get(UserDataFactory);
  const user = await findUser("user1@keybr.com");
  const userData = factory.load(new PublicId(user.id!));
  await userData.append([faker.nextResult()]);

  const request = startApp(context.get(Application, kMain));

  await request.become(user.id!);

  // Act, Assert.

  assert.isTrue(await userData.exists());

  assert.strictEqual(
    (
      await request //
        .DELETE("/_/sync/data")
        .send()
    ).status,
    204,
  );

  assert.isFalse(await userData.exists());
});
