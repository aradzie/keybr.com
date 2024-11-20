import { test } from "node:test";
import { Application } from "@fastr/core";
import { equal } from "rich-assert";
import { kGame } from "../index.ts";
import { TestContext } from "../test/context.ts";
import { startApp } from "../test/request.ts";

const context = new TestContext();

test("only handle websocket connection", async () => {
  // Arrange.

  const request = startApp(context.get(Application, kGame));

  // Act.

  const response = await request.GET("/_/game/server").send();

  // Assert.

  const { status, statusText, headers } = response;
  equal(status, 426);
  equal(statusText, "Upgrade Required");
  equal(headers.get("Connection"), "close");
  equal(headers.get("Upgrade"), "websocket");
  equal(headers.get("Content-Type"), "text/plain; charset=UTF-8");
  equal(await response.body.text(), "Upgrade to websocket required");
});
