import { request } from "@fastr/client";
import { start } from "@fastr/client-testlib";
import { Application } from "@fastr/core";
import { ApplicationError, ForbiddenError } from "@fastr/errors";
import { Container } from "@fastr/invert";
import { Manifest } from "@keybr/assets";
import { Level, Logger, type Message, type Transport } from "@keybr/logger";
import test from "ava";
import cheerio from "cheerio";
import { ErrorHandler } from "./index.ts";

test("throw http error", async (t) => {
  // Arrange.

  const { app, messages } = init();
  app.use((ctx) => {
    ctx.response.body = { json: true };
    throw new ForbiddenError("My message");
  });

  // Act.

  const { status, headers, body } = await request
    .use(start(app.callback()))
    .GET("/")
    .send();

  // Assert.

  t.is(status, 403);
  t.is(headers.get("Content-Type"), "text/html; charset=UTF-8");
  const $ = cheerio.load(await body.text());
  t.is($("title").text(), "403 - My message");
  t.is($("h1").text(), "403 - My message");
  t.is($("p").text(), "You cannot access this page.Start over");

  t.deepEqual(messages, ["DEBUG: Client error - My message"]);
});

test("set status code", async (t) => {
  // Arrange.

  const { app, messages } = init();
  app.use((ctx) => {
    ctx.response.status = 400;
  });

  // Act.

  const { status, headers, body } = await request
    .use(start(app.callback()))
    .GET("/")
    .send();

  // Assert.

  t.is(status, 400);
  t.is(headers.get("Content-Type"), "text/html; charset=UTF-8");
  const $ = cheerio.load(await body.text());
  t.is($("title").text(), "400 - Bad Request");
  t.is($("h1").text(), "400 - Bad Request");
  t.is(
    $("p").text(),
    "Request contained invalid data or parameters.Start over",
  );

  t.deepEqual(messages, []);
});

test("set status code and custom body", async (t) => {
  // Arrange.

  const { app, messages } = init();
  app.use((ctx) => {
    ctx.response.body = { json: true };
    ctx.response.status = 400;
  });

  // Act.

  const { status, headers, body } = await request
    .use(start(app.callback()))
    .GET("/")
    .send();

  // Assert.

  t.is(status, 400);
  t.is(headers.get("Content-Type"), "application/json; charset=UTF-8");
  t.deepEqual(await body.json(), { json: true });

  t.deepEqual(messages, []);
});

test("throw application error", async (t) => {
  // Arrange.

  const { app, messages } = init();
  app.use(() => {
    throw new ApplicationError("Validation error");
  });

  // Act.

  const { status, headers, body } = await request
    .use(start(app.callback()))
    .GET("/")
    .send();

  // Assert.

  t.is(status, 200);
  t.is(headers.get("Content-Type"), "application/error+json; charset=UTF-8");
  t.deepEqual(await body.json(), {
    error: {
      message: "Validation error",
    },
  });

  t.deepEqual(messages, ["DEBUG: Application error - Validation error"]);
});

test("throw runtime error", async (t) => {
  // Arrange.

  const { app, messages } = init();
  app.use(() => {
    throw new Error("Internal bug");
  });

  // Act.

  const { status, headers, body } = await request
    .use(start(app.callback()))
    .GET("/")
    .send();

  // Assert.

  t.is(status, 500);
  t.is(headers.get("Content-Type"), "text/html; charset=UTF-8");
  const $ = cheerio.load(await body.text());
  t.is($("title").text(), "500 - Internal Server Error");
  t.is($("h1").text(), "500 - Internal Server Error");
  t.is(
    $("p").text(),
    "Something is wrong with our server. Please try again later.Start over",
  );

  t.deepEqual(messages, ["ERROR: Server error - Internal bug"]);
});

test("handle invalid client request", async (t) => {
  // Arrange.

  const { app, messages } = init();
  app.use(() => {
    throw new Error("Internal bug");
  });

  // Act.

  const { status, headers, body } = await request
    .use(start(app.callback()))
    .GET("/")
    .header("Accept", "text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2")
    .send();

  // Assert.

  t.is(status, 500);
  t.is(headers.get("Content-Type"), "text/html; charset=UTF-8");
  const $ = cheerio.load(await body.text());
  t.is($("title").text(), "500 - Internal Server Error");
  t.is($("h1").text(), "500 - Internal Server Error");
  t.is(
    $("p").text(),
    "Something is wrong with our server. Please try again later.Start over",
  );

  t.deepEqual(messages, ["ERROR: Server error - Internal bug"]);
});

function init(): { app: Application; messages: string[] } {
  const messages: string[] = [];

  class FakeTransport implements Transport {
    append(message: Message): void {
      messages.push(format(message));
    }
  }

  Logger.configure({
    level: Level.DEBUG,
    transports: [new FakeTransport()],
  });

  const container = new Container();
  container.bind(Manifest).toValue(Manifest.fake);
  const app = new Application(container);
  app.use(ErrorHandler);
  return { app, messages };
}

function format(message: Message): string {
  const { level, err, format } = message;
  let msg = `${Level[level]}: ${format}`;
  if (err != null) {
    msg += ` - ${err.message}`;
  }
  return msg;
}
