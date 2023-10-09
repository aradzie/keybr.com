import { Application } from "@fastr/core";
import { Settings, stringProp } from "@keybr/settings";
import { SettingsDatabase } from "@keybr/settings-database";
import { kMain } from "../module.ts";
import { test } from "../test/context.ts";
import { startApp } from "../test/request.ts";
import { findUser } from "../test/sql.ts";

test.serial("handle unauthenticated user", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));

  // Assert.

  t.is((await request.GET("/_/sync/settings").send()).status, 403);
  t.is((await request.PUT("/_/sync/settings").send({})).status, 403);
  t.is((await request.DELETE("/_/sync/settings").send({})).status, 403);
});

test.serial("get empty settings", async (t) => {
  // Arrange.

  const user = await findUser("user1@keybr.com");
  const request = startApp(t.context.get(Application, kMain));
  await request.become(user.id!);

  // Act.

  const response = await request.GET("/_/sync/settings").send();

  // Assert.

  t.is(response.status, 200);
  t.is(response.headers.get("Content-Type"), "application/json; charset=UTF-8");
  t.is(response.headers.get("Cache-Control"), "private, no-cache");
  t.deepEqual(await response.body.json(), {});
});

test.serial("get existing settings", async (t) => {
  // Arrange.

  const user = await findUser("user1@keybr.com");
  const request = startApp(t.context.get(Application, kMain));
  await request.become(user.id!);

  const database = t.context.get(SettingsDatabase);
  await database.set(
    user.id!,
    new Settings().set(stringProp("prop", "abc"), "abc"),
  );

  // Act.

  const response = await request.GET("/_/sync/settings").send();

  // Assert.

  t.is(response.status, 200);
  t.is(response.headers.get("Content-Type"), "application/json; charset=UTF-8");
  t.is(response.headers.get("Cache-Control"), "private, no-cache");
  t.like(await response.body.json(), {
    prop: "abc",
  });
});

test.serial("validate content type on put settings", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));
  await request.become("user1@keybr.com");

  // Act.

  const response = await request
    .PUT("/_/sync/settings")
    .type("text/plain")
    .send("something");

  // Assert.

  t.is(response.status, 415);
});

test.serial("validate format on put settings", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));
  await request.become("user1@keybr.com");

  // Act.

  const response = await request
    .PUT("/_/sync/settings")
    .type("application/json")
    .send("garbage");

  // Assert.

  t.is(response.status, 400);
});

test.serial("put settings", async (t) => {
  // Arrange.

  const user = await findUser("user1@keybr.com");
  const request = startApp(t.context.get(Application, kMain));
  await request.become(user.id!);

  const database = t.context.get(SettingsDatabase);
  await database.set(user.id!, null);

  // Act.

  const response = await request
    .PUT("/_/sync/settings")
    .send(new Settings().set(stringProp("prop", "abc"), "abc").toJSON());

  // Assert.

  t.is(response.status, 204);
  t.like((await database.get(user.id!))?.toJSON(), { prop: "abc" });
});

test.serial("delete settings", async (t) => {
  // Arrange.

  const user = await findUser("user1@keybr.com");
  const request = startApp(t.context.get(Application, kMain));
  await request.become(user.id!);

  const database = t.context.get(SettingsDatabase);
  await database.set(
    user.id!,
    new Settings().set(stringProp("prop", "abc"), "abc"),
  );

  // Act.

  const response = await request.DELETE("/_/sync/settings").send();

  // Assert.

  t.is(response.status, 204);
  t.is(await database.get(user.id!), null);
});
