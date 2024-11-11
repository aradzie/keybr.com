import { test } from "node:test";
import { request } from "@fastr/client";
import { start } from "@fastr/client-testlib";
import { Application } from "@fastr/core";
import { ApplicationError, ForbiddenError } from "@fastr/errors";
import { Container } from "@fastr/invert";
import { Manifest } from "@keybr/assets";
import { Level, Logger, type Message, type Transport } from "@keybr/logger";
import { assert } from "chai";
import { createTestServer } from "../test/request.ts";
import { ErrorHandler } from "./index.ts";

test("throw http error", async () => {
  // Arrange.

  const { app, messages } = init();
  app.use((ctx) => {
    ctx.response.body = { json: true };
    throw new ForbiddenError("My message");
  });

  // Act.

  const { status, headers, body } = await request
    .use(start(createTestServer(app.callback())))
    .GET("/")
    .send();

  // Assert.

  assert.strictEqual(status, 403);
  assert.strictEqual(headers.get("Content-Type"), "text/html; charset=UTF-8");
  assert.include(await body.text(), "403 - My message");
  assert.deepStrictEqual(messages, ["DEBUG: Client error - My message"]);
});

test("set status code", async () => {
  // Arrange.

  const { app, messages } = init();
  app.use((ctx) => {
    ctx.response.status = 400;
  });

  // Act.

  const { status, headers, body } = await request
    .use(start(createTestServer(app.callback())))
    .GET("/")
    .send();

  // Assert.

  assert.strictEqual(status, 400);
  assert.strictEqual(headers.get("Content-Type"), "text/html; charset=UTF-8");
  assert.include(await body.text(), "400 - Bad Request");
  assert.deepStrictEqual(messages, []);
});

test("set status code and custom body", async () => {
  // Arrange.

  const { app, messages } = init();
  app.use((ctx) => {
    ctx.response.body = { json: true };
    ctx.response.status = 400;
  });

  // Act.

  const { status, headers, body } = await request
    .use(start(createTestServer(app.callback())))
    .GET("/")
    .send();

  // Assert.

  assert.strictEqual(status, 400);
  assert.strictEqual(
    headers.get("Content-Type"),
    "application/json; charset=UTF-8",
  );
  assert.deepStrictEqual(await body.json(), { json: true });
  assert.deepStrictEqual(messages, []);
});

test("throw application error", async () => {
  // Arrange.

  const { app, messages } = init();
  app.use(() => {
    throw new ApplicationError("Validation error");
  });

  // Act.

  const { status, headers, body } = await request
    .use(start(createTestServer(app.callback())))
    .GET("/")
    .send();

  // Assert.

  assert.strictEqual(status, 200);
  assert.strictEqual(
    headers.get("Content-Type"),
    "application/error+json; charset=UTF-8",
  );
  assert.deepStrictEqual(await body.json(), {
    error: {
      message: "Validation error",
    },
  });
  assert.deepStrictEqual(messages, [
    "DEBUG: Application error - Validation error",
  ]);
});

test("throw runtime error", async () => {
  // Arrange.

  const { app, messages } = init();
  app.use(() => {
    throw new Error("Internal bug");
  });

  // Act.

  const { status, headers, body } = await request
    .use(start(createTestServer(app.callback())))
    .GET("/")
    .send();

  // Assert.

  assert.strictEqual(status, 500);
  assert.strictEqual(headers.get("Content-Type"), "text/html; charset=UTF-8");
  assert.include(await body.text(), "500 - Internal Server Error");
  assert.deepStrictEqual(messages, ["ERROR: Server error - Internal bug"]);
});

test("handle invalid client request", async () => {
  // Arrange.

  const { app, messages } = init();
  app.use(() => {
    throw new Error("Internal bug");
  });

  // Act.

  const { status, headers, body } = await request
    .use(start(createTestServer(app.callback())))
    .GET("/")
    .header("Accept", "text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2")
    .send();

  // Assert.

  assert.strictEqual(status, 500);
  assert.strictEqual(headers.get("Content-Type"), "text/html; charset=UTF-8");
  assert.include(await body.text(), "500 - Internal Server Error");
  assert.deepStrictEqual(messages, ["ERROR: Server error - Internal bug"]);
});

function init() {
  const messages: string[] = [];

  Logger.configure({
    level: Level.DEBUG,
    transports: [
      new (class FakeTransport implements Transport {
        append(message: Message) {
          messages.push(format(message));
        }
      })(),
    ],
  });

  const container = new Container();
  container.bind(Manifest).toValue(Manifest.fake);
  const app = new Application(container);
  app.use(ErrorHandler);
  return { app, messages };
}

function format({ level, err, format }: Message) {
  let msg = `${Level[level]}: ${format}`;
  if (err != null) {
    msg += ` - ${err.message}`;
  }
  return msg;
}
