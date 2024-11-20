import { test } from "node:test";
import { Application } from "@fastr/core";
import { PublicId } from "@keybr/publicid";
import { ResultFaker } from "@keybr/result";
import { formatMessage } from "@keybr/result-io";
import { UserDataFactory } from "@keybr/result-userdata";
import { equal, isFalse, isTrue, match } from "rich-assert";
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

  equal((await request.GET("/_/sync/data").send()).status, 403);
  equal((await request.POST("/_/sync/data").send(validBody)).status, 403);
  equal((await request.DELETE("/_/sync/data").send()).status, 403);
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

  equal(response.status, 200);
  equal(response.headers.get("Content-Type"), "application/octet-stream");
  match(response.headers.get("Content-Length")!, /\d+/);
  equal(response.headers.get("Content-Encoding"), null);
  equal(response.headers.get("Cache-Control"), "private, no-cache");
  match(response.headers.get("ETag")!, /"[a-z0-9]+"/);
  isTrue((await response.body.buffer()).length > 0);
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

  equal(response.status, 200);
  equal(response.headers.get("Content-Type"), "application/octet-stream");
  equal(response.headers.get("Content-Length"), "0");
  equal(response.headers.get("Content-Encoding"), null);
  equal(response.headers.get("Cache-Control"), "private, no-cache");
  match(response.headers.get("ETag")!, /"[a-z0-9]+"/);
  equal((await response.body.buffer()).length, 0);
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

  equal(response.status, 200);
  equal(response.headers.get("Content-Type"), "application/octet-stream");
  equal(response.headers.get("Content-Length"), "70");
  equal(response.headers.get("Content-Encoding"), null);
  equal(response.headers.get("Cache-Control"), "private, no-cache");
  match(response.headers.get("ETag")!, /"[a-z0-9]+"/);
  equal((await response.body.buffer()).length, 70);
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

  equal(response.status, 415);
});

test("validate format on post", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const request = startApp(context.get(Application, kMain));

  await request.become("user1@keybr.com");

  // Act.

  const response = await request.POST("/_/sync/data").send(garbageBody);

  // Assert.

  equal(response.status, 400);
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

  equal(response.status, 204);

  isFalse(await userData.exists());
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

  equal(response.status, 204);

  isTrue(await userData.exists());
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

  isFalse(await userData.exists());

  equal(
    (
      await request //
        .DELETE("/_/sync/data")
        .send()
    ).status,
    204,
  );

  isFalse(await userData.exists());
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

  isTrue(await userData.exists());

  equal(
    (
      await request //
        .DELETE("/_/sync/data")
        .send()
    ).status,
    204,
  );

  isFalse(await userData.exists());
});
