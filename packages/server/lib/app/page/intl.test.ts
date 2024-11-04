import { test } from "node:test";
import { Application } from "@fastr/core";
import { AcceptLanguage } from "@fastr/headers";
import { assert } from "chai";
import { TestContext } from "../test/context.ts";
import { startApp } from "../test/request.ts";
import { preferredLocale } from "./intl.ts";

const context = new TestContext();

test("negotiate the preferred language", async () => {
  // Arrange.

  const request = startApp(
    new Application().use((ctx) => {
      ctx.response.body = preferredLocale(ctx);
    }),
  );

  const call = async (language: AcceptLanguage | null): Promise<string> => {
    const builder = request.GET("/");
    if (language != null) {
      builder.header("Accept-Language", language);
    }
    return await (await builder.send()).body.text();
  };

  // Assert.

  assert.strictEqual(await call(null), "en");
  assert.strictEqual(await call(new AcceptLanguage("*")), "en");
  assert.strictEqual(await call(new AcceptLanguage("xx")), "en");

  assert.strictEqual(await call(new AcceptLanguage("en")), "en");
  assert.strictEqual(await call(new AcceptLanguage("en-US")), "en");
  assert.strictEqual(await call(new AcceptLanguage("en-CA")), "en");

  assert.strictEqual(await call(new AcceptLanguage("pt")), "pt-br");
  assert.strictEqual(await call(new AcceptLanguage("pt-BR")), "pt-br");
  assert.strictEqual(await call(new AcceptLanguage("pt-PT")), "pt-pt");

  assert.strictEqual(await call(new AcceptLanguage("zh")), "zh-hans");
  assert.strictEqual(await call(new AcceptLanguage("zh-CN")), "zh-hans");
  assert.strictEqual(await call(new AcceptLanguage("zh-TW")), "zh-hant");

  assert.strictEqual(
    await call(new AcceptLanguage().add("en", 0.8).add("pl", 0.9)),
    "pl",
  );
});
