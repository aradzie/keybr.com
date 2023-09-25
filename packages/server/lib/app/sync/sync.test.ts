import { Application } from "@fastr/core";
import { PublicId } from "@keybr/publicid";
import { ResultFaker } from "@keybr/result";
import { UserDataFactory } from "@keybr/result-userdata";
import { kMain } from "../module.ts";
import { test } from "../test/context.ts";
import { startApp } from "../test/request.ts";
import { findUser } from "../test/sql.ts";

const data = Buffer.from(
  "MNP5Z1Mvt46icVrELajnGKFdC+51UeyEKeATXNzy" +
    "92sJzhG+hOgc2AlVa0JHSIbytPYrD92WhaIYbFT83" +
    "Rlf4mtMuhZMSp/zYR5Jxuyg",
  "base64",
);

test.serial("handle unauthenticated user", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));

  // Assert.

  t.is((await request.GET("/_/sync/data").send()).status, 403);
  t.is((await request.POST("/_/sync/data").send(data)).status, 403);
  t.is((await request.DELETE("/_/sync/data").send()).status, 403);
});

test.serial("get public user data", async (t) => {
  // Arrange.

  const factory = t.context.get(UserDataFactory);
  const user = await findUser("user1@keybr.com");
  const id = new PublicId(user.id!);
  const userData = factory.load(id);
  const faker = new ResultFaker();
  await userData.append([faker.nextResult()]);

  const request = startApp(t.context.get(Application, kMain));

  // Act.

  const response = await request.GET("/_/sync/data/" + id).send();

  // Assert.

  t.is(response.status, 200);
  t.is(response.headers.get("Content-Type"), "application/octet-stream");
  t.regex(response.headers.get("Content-Length")!, /\d+/);
  t.is(response.headers.get("Content-Encoding"), null);
  t.is(response.headers.get("Cache-Control"), "private, no-cache");
  t.regex(response.headers.get("ETag")!, /"[a-z0-9]+"/);
  t.true((await response.body.buffer()).length > 0);
});

test.serial("get empty user data", async (t) => {
  // Arrange.

  const factory = t.context.get(UserDataFactory);
  const user = await findUser("user1@keybr.com");
  const userData = factory.load(new PublicId(user.id!));
  await userData.delete();

  const request = startApp(t.context.get(Application, kMain));

  await request.become(user.id!);

  // Act.

  const response = await request.GET("/_/sync/data").send();

  // Assert.

  t.is(response.status, 200);
  t.is(response.headers.get("Content-Type"), "application/octet-stream");
  t.is(response.headers.get("Content-Length"), "0");
  t.is(response.headers.get("Content-Encoding"), null);
  t.is(response.headers.get("Cache-Control"), "private, no-cache");
  t.regex(response.headers.get("ETag")!, /"[a-z0-9]+"/);
  t.is((await response.body.buffer()).length, 0);
});

test.serial("get existing user data", async (t) => {
  // Arrange.

  const factory = t.context.get(UserDataFactory);
  const user = await findUser("user1@keybr.com");
  const userData = factory.load(new PublicId(user.id!));
  const faker = new ResultFaker();
  await userData.append([faker.nextResult()]);

  const request = startApp(t.context.get(Application, kMain));

  await request.become(user.id!);

  // Act.

  const response = await request.GET("/_/sync/data").send();

  // Assert.

  t.is(response.status, 200);
  t.is(response.headers.get("Content-Type"), "application/octet-stream");
  t.is(response.headers.get("Content-Length"), "70");
  t.is(response.headers.get("Content-Encoding"), null);
  t.is(response.headers.get("Cache-Control"), "private, no-cache");
  t.regex(response.headers.get("ETag")!, /"[a-z0-9]+"/);
  t.is((await response.body.buffer()).length, 70);
});

test.serial("validate content type on post", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));

  await request.become("user1@keybr.com");

  // Act.

  const response = await request
    .POST("/_/sync/data")
    .type("text/plain")
    .send(data);

  // Assert.

  t.is(response.status, 415);
});

test.serial("validate format on post", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));

  await request.become("user1@keybr.com");

  // Act.

  const response = await request
    .POST("/_/sync/data")
    .send(Buffer.from("garbage"));

  // Assert.

  t.is(response.status, 400);
});

test.serial("post to user data", async (t) => {
  // Arrange.

  const factory = t.context.get(UserDataFactory);
  const user = await findUser("user1@keybr.com");
  const userData = factory.load(new PublicId(user.id!));
  await userData.delete();

  const request = startApp(t.context.get(Application, kMain));

  await request.become(user.id!);

  // Act.

  const response = await request.POST("/_/sync/data").send(data);

  // Assert.

  t.is(response.status, 204);

  t.true(await userData.exists());
});

test.serial("delete empty user data", async (t) => {
  // Arrange.

  const factory = t.context.get(UserDataFactory);
  const user = await findUser("user1@keybr.com");
  const userData = factory.load(new PublicId(user.id!));
  await userData.delete();

  const request = startApp(t.context.get(Application, kMain));

  await request.become(user.id!);

  // Act, Assert.

  t.false(await userData.exists());

  t.is(
    (
      await request //
        .DELETE("/_/sync/data")
        .send()
    ).status,
    204,
  );

  t.false(await userData.exists());
});

test.serial("delete existing user data", async (t) => {
  // Arrange.

  const factory = t.context.get(UserDataFactory);
  const user = await findUser("user1@keybr.com");
  const userData = factory.load(new PublicId(user.id!));
  const faker = new ResultFaker();
  await userData.append([faker.nextResult()]);

  const request = startApp(t.context.get(Application, kMain));

  await request.become(user.id!);

  // Act, Assert.

  t.true(await userData.exists());

  t.is(
    (
      await request //
        .DELETE("/_/sync/data")
        .send()
    ).status,
    204,
  );

  t.false(await userData.exists());
});
