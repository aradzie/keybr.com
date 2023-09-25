import { Application } from "@fastr/core";
import { kGame } from "../index.ts";
import { test } from "../test/context.ts";
import { startApp } from "../test/request.ts";

test("only handle websocket connection", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kGame));

  // Act.

  const response = await request.GET("/_/game/server").send();

  // Assert.

  const { status, statusText, headers } = response;
  t.is(status, 426);
  t.is(statusText, "Upgrade Required");
  t.is(headers.get("Connection"), "close");
  t.is(headers.get("Upgrade"), "websocket");
  t.is(headers.get("Content-Type"), "text/plain; charset=UTF-8");
  t.is(await response.body.text(), "Upgrade to websocket required");
});
