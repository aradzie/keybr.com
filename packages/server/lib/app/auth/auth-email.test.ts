import { test } from "node:test";
import { Application } from "@fastr/core";
import { User, UserLoginRequest } from "@keybr/database";
import { assert } from "chai";
import { load } from "cheerio";
import { kMain } from "../module.ts";
import { TestContext } from "../test/context.ts";
import { startApp } from "../test/request.ts";

const context = new TestContext();

test("send a new access token", async () => {
  // Arrange.

  const request = startApp(context.get(Application, kMain));

  // Act.

  const response = await request //
    .POST("/auth/login/register-email")
    .send({
      email: "test@keybr.com",
    });

  // Assert.

  assert.strictEqual(response.status, 200);
  assert.strictEqual(
    response.headers.get("Content-Type"),
    "application/json; charset=UTF-8",
  );
  assert.deepStrictEqual(await response.body.json(), {
    email: "test@keybr.com",
  });

  assert.isNull(await request.who());

  const userLoginRequest = await UserLoginRequest.findByEmail("test@keybr.com");
  assert.isNotNull(userLoginRequest);

  const user = await User.findByEmail("test@keybr.com");
  assert.isNull(user);

  const [message] = context.mailer.dump();
  assert.strictEqual(message.to, "test@keybr.com");
  assert.isTrue(message.text!.includes(userLoginRequest!.accessToken!));
});

test("send an existing access token", async () => {
  // Arrange.

  await UserLoginRequest.query().insertGraph({
    email: "test@keybr.com",
    accessToken: "xyz",
    createdAt: new Date(),
  } as UserLoginRequest);

  const request = startApp(context.get(Application, kMain));

  // Act.

  const response = await request //
    .POST("/auth/login/register-email")
    .send({
      email: "test@keybr.com",
    });

  // Assert.

  assert.strictEqual(response.status, 200);
  assert.strictEqual(
    response.headers.get("Content-Type"),
    "application/json; charset=UTF-8",
  );
  assert.deepStrictEqual(await response.body.json(), {
    email: "test@keybr.com",
  });

  assert.isNull(await request.who());

  const userLoginRequest = await UserLoginRequest.findByEmail("test@keybr.com");
  assert.isNotNull(userLoginRequest);

  const user = await User.findByEmail("test@keybr.com");
  assert.isNull(user);

  const [message] = context.mailer.dump();
  assert.strictEqual(message.to, "test@keybr.com");
  assert.isTrue(message.text!.includes(userLoginRequest!.accessToken!));
});

test("login with an access token / new user", async () => {
  // Arrange.

  await UserLoginRequest.query().insertGraph({
    email: "test@keybr.com",
    accessToken: "xyz",
    createdAt: new Date(),
  } as UserLoginRequest);

  const request = startApp(context.get(Application, kMain));

  // Act.

  const response = await request.GET("/login/xyz").send();

  // Assert.

  assert.strictEqual(response.status, 302);
  assert.strictEqual(response.headers.get("Location"), "/account");

  const userLoginRequest = await UserLoginRequest.findByEmail("test@keybr.com");
  assert.isNotNull(userLoginRequest);

  const user = await User.findByEmail("test@keybr.com");
  assert.isNotNull(user);

  assert.strictEqual(await request.who(), "test@keybr.com");

  assert.deepStrictEqual(context.mailer.dump(), []);
});

test("login with an access token / existing user", async () => {
  // Arrange.

  await User.query().insertGraph({
    email: "test@keybr.com",
    name: "test",
    createdAt: new Date(),
  } as User);

  await UserLoginRequest.query().insertGraph({
    email: "test@keybr.com",
    accessToken: "xyz",
    createdAt: new Date(),
  } as UserLoginRequest);

  const request = startApp(context.get(Application, kMain));

  // Act.

  const response = await request.GET("/login/xyz").send();

  // Assert.

  assert.strictEqual(response.status, 302);
  assert.strictEqual(response.headers.get("Location"), "/account");

  const userLoginRequest = await UserLoginRequest.findByEmail("test@keybr.com");
  assert.isNotNull(userLoginRequest);

  const user = await User.findByEmail("test@keybr.com");
  assert.isNotNull(user);

  assert.strictEqual(await request.who(), "test@keybr.com");

  assert.deepStrictEqual(context.mailer.dump(), []);
});

test("ignore invalid access token", async () => {
  // Arrange.

  const request = startApp(context.get(Application, kMain));

  // Act.

  const response = await request.GET("/login/xyz").send();

  // Assert.

  assert.strictEqual(response.status, 403);

  const $ = load(await response.body.text());
  assert.isTrue($("body").text().includes("Invalid login link"));

  assert.isNull(await request.who());

  assert.deepStrictEqual(context.mailer.dump(), []);
});
