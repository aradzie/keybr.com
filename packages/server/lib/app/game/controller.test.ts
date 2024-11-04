import { test } from "node:test";
import { Application } from "@fastr/core";
import { assert } from "chai";
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
  assert.strictEqual(status, 426);
  assert.strictEqual(statusText, "Upgrade Required");
  assert.strictEqual(headers.get("Connection"), "close");
  assert.strictEqual(headers.get("Upgrade"), "websocket");
  assert.strictEqual(headers.get("Content-Type"), "text/plain; charset=UTF-8");
  assert.strictEqual(
    await response.body.text(),
    "Upgrade to websocket required",
  );
});
