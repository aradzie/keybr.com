import { test } from "node:test";
import { Application } from "@fastr/core";
import { AcceptLanguage } from "@fastr/headers";
import { equal } from "rich-assert";
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

  equal(await call(null), "en");
  equal(await call(new AcceptLanguage("*")), "en");
  equal(await call(new AcceptLanguage("xx")), "en");

  equal(await call(new AcceptLanguage("en")), "en");
  equal(await call(new AcceptLanguage("en-US")), "en");
  equal(await call(new AcceptLanguage("en-CA")), "en");

  equal(await call(new AcceptLanguage("pt")), "pt-br");
  equal(await call(new AcceptLanguage("pt-BR")), "pt-br");
  equal(await call(new AcceptLanguage("pt-PT")), "pt-pt");

  equal(await call(new AcceptLanguage("zh")), "zh-hans");
  equal(await call(new AcceptLanguage("zh-CN")), "zh-hans");
  equal(await call(new AcceptLanguage("zh-TW")), "zh-hant");

  equal(await call(new AcceptLanguage().add("en", 0.8).add("pl", 0.9)), "pl");
});
