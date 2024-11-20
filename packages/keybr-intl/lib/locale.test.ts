import { test } from "node:test";
import { equal } from "rich-assert";
import { selectLocale } from "./locale.ts";

test("select locale", () => {
  const filter =
    (...found: string[]) =>
    (...locales: string[]) =>
      locales.find((locale) => found.includes(locale)) ?? null;
  equal(selectLocale(filter()), "en");
  equal(selectLocale(filter("xx")), "en");
  equal(selectLocale(filter("en")), "en");
  equal(selectLocale(filter("en-US")), "en");
  equal(selectLocale(filter("en-CA")), "en");
  equal(selectLocale(filter("pt")), "pt-br");
  equal(selectLocale(filter("pt-BR")), "pt-br");
  equal(selectLocale(filter("pt-PT")), "pt-pt");
  equal(selectLocale(filter("zh")), "zh-hans");
  equal(selectLocale(filter("zh-CN")), "zh-hans");
  equal(selectLocale(filter("zh-TW")), "zh-hant");
});
