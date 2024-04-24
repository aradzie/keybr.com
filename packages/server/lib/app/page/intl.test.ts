import { Application } from "@fastr/core";
import { AcceptLanguage } from "@fastr/headers";
import { test } from "../test/context.ts";
import { startApp } from "../test/request.ts";
import { preferredLocale } from "./intl.ts";

test("negotiate the preferred language", async (t) => {
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

  t.is(await call(null), "en");
  t.is(await call(new AcceptLanguage("*")), "en");
  t.is(await call(new AcceptLanguage("xx")), "en");

  t.is(await call(new AcceptLanguage("en")), "en");
  t.is(await call(new AcceptLanguage("en-US")), "en");
  t.is(await call(new AcceptLanguage("en-CA")), "en");

  t.is(await call(new AcceptLanguage("pt")), "pt-br");
  t.is(await call(new AcceptLanguage("pt-BR")), "pt-br");
  t.is(await call(new AcceptLanguage("pt-PT")), "pt-pt");

  t.is(await call(new AcceptLanguage("zh")), "zh-hans");
  t.is(await call(new AcceptLanguage("zh-CN")), "zh-hans");
  t.is(await call(new AcceptLanguage("zh-TW")), "zh-hant");

  t.is(await call(new AcceptLanguage().add("en", 0.8).add("pl", 0.9)), "pl");
});
