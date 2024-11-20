import { test } from "node:test";
import { Application } from "@fastr/core";
import { Settings, stringProp } from "@keybr/settings";
import { SettingsDatabase } from "@keybr/settings-database";
import { deepEqual, equal, like } from "rich-assert";
import { kMain } from "../module.ts";
import { TestContext } from "../test/context.ts";
import { startApp } from "../test/request.ts";
import { findUser } from "../test/sql.ts";

const context = new TestContext();

test("handle unauthenticated user", async () => {
  // Arrange.

  const request = startApp(context.get(Application, kMain));

  // Assert.

  equal((await request.GET("/_/sync/settings").send()).status, 403);
  equal((await request.PUT("/_/sync/settings").send({})).status, 403);
  equal((await request.DELETE("/_/sync/settings").send({})).status, 403);
});

test("get empty settings", async () => {
  // Arrange.

  const user = await findUser("user1@keybr.com");
  const request = startApp(context.get(Application, kMain));
  await request.become(user.id!);

  // Act.

  const response = await request.GET("/_/sync/settings").send();

  // Assert.

  equal(response.status, 200);
  equal(
    response.headers.get("Content-Type"),
    "application/json; charset=UTF-8",
  );
  equal(response.headers.get("Cache-Control"), "private, no-cache");
  deepEqual(await response.body.json(), {});
});

test("get existing settings", async () => {
  // Arrange.

  const user = await findUser("user1@keybr.com");
  const request = startApp(context.get(Application, kMain));
  await request.become(user.id!);

  const database = context.get(SettingsDatabase);
  await database.set(
    user.id!,
    new Settings().set(stringProp("prop", "abc"), "abc"),
  );

  // Act.

  const response = await request.GET("/_/sync/settings").send();

  // Assert.

  equal(response.status, 200);
  equal(
    response.headers.get("Content-Type"),
    "application/json; charset=UTF-8",
  );
  equal(response.headers.get("Cache-Control"), "private, no-cache");
  like(await response.body.json(), {
    prop: "abc",
  });
});

test("validate content type on put settings", async () => {
  // Arrange.

  const request = startApp(context.get(Application, kMain));
  await request.become("user1@keybr.com");

  // Act.

  const response = await request
    .PUT("/_/sync/settings")
    .type("text/plain")
    .send("something");

  // Assert.

  equal(response.status, 415);
});

test("validate format on put settings", async () => {
  // Arrange.

  const request = startApp(context.get(Application, kMain));
  await request.become("user1@keybr.com");

  // Act.

  const response = await request
    .PUT("/_/sync/settings")
    .type("application/json")
    .send("garbage");

  // Assert.

  equal(response.status, 400);
});

test("handle put settings", async () => {
  // Arrange.

  const user = await findUser("user1@keybr.com");
  const request = startApp(context.get(Application, kMain));
  await request.become(user.id!);

  const database = context.get(SettingsDatabase);
  await database.set(user.id!, null);

  // Act.

  const response = await request
    .PUT("/_/sync/settings")
    .send(new Settings().set(stringProp("prop", "abc"), "abc").toJSON());

  // Assert.

  equal(response.status, 204);
  like((await database.get(user.id!))?.toJSON(), {
    prop: "abc",
  });
});

test("handle delete settings", async () => {
  // Arrange.

  const user = await findUser("user1@keybr.com");
  const request = startApp(context.get(Application, kMain));
  await request.become(user.id!);

  const database = context.get(SettingsDatabase);
  await database.set(
    user.id!,
    new Settings().set(stringProp("prop", "abc"), "abc"),
  );

  // Act.

  const response = await request.DELETE("/_/sync/settings").send();

  // Assert.

  equal(response.status, 204);
  equal(await database.get(user.id!), null);
});
