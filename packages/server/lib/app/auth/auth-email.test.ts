import { Application } from "@fastr/core";
import { User, UserLoginRequest } from "@keybr/database";
import cheerio from "cheerio";
import { kMain } from "../module.ts";
import { test } from "../test/context.ts";
import { startApp } from "../test/request.ts";

test.serial("fail if email is invalid", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));

  // Act.

  const response = await request //
    .POST("/auth/login/register-email")
    .send({
      email: "invalid",
    });

  // Assert.

  t.is(response.status, 200);
  t.is(
    response.headers.get("Content-Type"),
    "application/error+json; charset=UTF-8",
  );
  t.deepEqual(await response.body.json(), {
    error: {
      message: "Invalid e-mail address",
    },
  });

  t.deepEqual(t.context.mailer.dump(), []);
});

test.serial("fail on email sending error", async (t) => {
  // Arrange.

  t.context.mailer.sendMail = () => {
    throw new Error("Transport error");
  };

  const request = startApp(t.context.get(Application, kMain));

  // Act.

  const response = await request //
    .POST("/auth/login/register-email")
    .send({
      email: "test@keybr.com",
    });

  // Assert.

  t.is(response.status, 200);
  t.is(
    response.headers.get("Content-Type"),
    "application/error+json; charset=UTF-8",
  );
  t.deepEqual(await response.body.json(), {
    error: {
      message: "Error sending e-mail message",
    },
  });
});

test.serial("send a new access token", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));

  // Act.

  const response = await request //
    .POST("/auth/login/register-email")
    .send({
      email: "test@keybr.com",
    });

  // Assert.

  t.is(response.status, 200);
  t.is(response.headers.get("Content-Type"), "application/json; charset=UTF-8");
  t.deepEqual(await response.body.json(), {
    email: "test@keybr.com",
  });

  t.is(await request.who(), null);

  const userLoginRequest = await UserLoginRequest.findByEmail("test@keybr.com");
  t.not(userLoginRequest, null);

  const user = await User.findByEmail("test@keybr.com");
  t.is(user, null);

  const [message] = t.context.mailer.dump();
  t.is(message.to, "test@keybr.com");
  t.true(message.text!.includes(userLoginRequest!.accessToken!));
});

test.serial("send an existing access token", async (t) => {
  // Arrange.

  await UserLoginRequest.query().insertGraph({
    email: "test@keybr.com",
    accessToken: "xyz",
    createdAt: new Date(),
  } as UserLoginRequest);

  const request = startApp(t.context.get(Application, kMain));

  // Act.

  const response = await request //
    .POST("/auth/login/register-email")
    .send({
      email: "test@keybr.com",
    });

  // Assert.

  t.is(response.status, 200);
  t.is(response.headers.get("Content-Type"), "application/json; charset=UTF-8");
  t.deepEqual(await response.body.json(), {
    email: "test@keybr.com",
  });

  t.is(await request.who(), null);

  const userLoginRequest = await UserLoginRequest.findByEmail("test@keybr.com");
  t.not(userLoginRequest, null);

  const user = await User.findByEmail("test@keybr.com");
  t.is(user, null);

  const [message] = t.context.mailer.dump();
  t.is(message.to, "test@keybr.com");
  t.true(message.text!.includes(userLoginRequest!.accessToken!));
});

test.serial("login with access token / new user", async (t) => {
  // Arrange.

  await UserLoginRequest.query().insertGraph({
    email: "test@keybr.com",
    accessToken: "xyz",
    createdAt: new Date(),
  } as UserLoginRequest);

  const request = startApp(t.context.get(Application, kMain));

  // Act.

  const response = await request.GET("/login/xyz").send();

  // Assert.

  t.is(response.status, 302);
  t.is(response.headers.get("Location"), "/account");

  const userLoginRequest = await UserLoginRequest.findByEmail("test@keybr.com");
  t.not(userLoginRequest, null);

  const user = await User.findByEmail("test@keybr.com");
  t.not(user, null);

  t.is(await request.who(), "test@keybr.com");

  t.deepEqual(t.context.mailer.dump(), []);
});

test.serial("login with access token / existing user", async (t) => {
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

  const request = startApp(t.context.get(Application, kMain));

  // Act.

  const response = await request.GET("/login/xyz").send();

  // Assert.

  t.is(response.status, 302);
  t.is(response.headers.get("Location"), "/account");

  const userLoginRequest = await UserLoginRequest.findByEmail("test@keybr.com");
  t.not(userLoginRequest, null);

  const user = await User.findByEmail("test@keybr.com");
  t.not(user, null);

  t.is(await request.who(), "test@keybr.com");

  t.deepEqual(t.context.mailer.dump(), []);
});

test.serial("ignore invalid access token", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));

  // Act.

  const response = await request.GET("/login/xyz").send();

  // Assert.

  t.is(response.status, 403);

  const $ = cheerio.load(await response.body.text());
  t.true($("body").text().includes("Invalid login link"));

  t.is(await request.who(), null);

  t.deepEqual(t.context.mailer.dump(), []);
});
