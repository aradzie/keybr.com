import { test } from "node:test";
import { Application } from "@fastr/core";
import { User, UserLoginRequest } from "@keybr/database";
import { load } from "cheerio";
import { deepEqual, equal, isNotNull, isNull, isTrue } from "rich-assert";
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

  equal(response.status, 200);
  equal(
    response.headers.get("Content-Type"),
    "application/json; charset=UTF-8",
  );
  deepEqual(await response.body.json(), {
    email: "test@keybr.com",
  });

  isNull(await request.who());

  const userLoginRequest = await UserLoginRequest.findByEmail("test@keybr.com");
  isNotNull(userLoginRequest);

  const user = await User.findByEmail("test@keybr.com");
  isNull(user);

  const [message] = context.mailer.dump();
  equal(message.to, "test@keybr.com");
  isTrue(message.text!.includes(userLoginRequest!.accessToken!));
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

  equal(response.status, 200);
  equal(
    response.headers.get("Content-Type"),
    "application/json; charset=UTF-8",
  );
  deepEqual(await response.body.json(), {
    email: "test@keybr.com",
  });

  isNull(await request.who());

  const userLoginRequest = await UserLoginRequest.findByEmail("test@keybr.com");
  isNotNull(userLoginRequest);

  const user = await User.findByEmail("test@keybr.com");
  isNull(user);

  const [message] = context.mailer.dump();
  equal(message.to, "test@keybr.com");
  isTrue(message.text!.includes(userLoginRequest!.accessToken!));
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

  equal(response.status, 302);
  equal(response.headers.get("Location"), "/account");

  const userLoginRequest = await UserLoginRequest.findByEmail("test@keybr.com");
  isNotNull(userLoginRequest);

  const user = await User.findByEmail("test@keybr.com");
  isNotNull(user);

  equal(await request.who(), "test@keybr.com");

  deepEqual(context.mailer.dump(), []);
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

  equal(response.status, 302);
  equal(response.headers.get("Location"), "/account");

  const userLoginRequest = await UserLoginRequest.findByEmail("test@keybr.com");
  isNotNull(userLoginRequest);

  const user = await User.findByEmail("test@keybr.com");
  isNotNull(user);

  equal(await request.who(), "test@keybr.com");

  deepEqual(context.mailer.dump(), []);
});

test("ignore invalid access token", async () => {
  // Arrange.

  const request = startApp(context.get(Application, kMain));

  // Act.

  const response = await request.GET("/login/xyz").send();

  // Assert.

  equal(response.status, 403);

  const $ = load(await response.body.text());
  isTrue($("body").text().includes("Invalid login link"));

  isNull(await request.who());

  deepEqual(context.mailer.dump(), []);
});
