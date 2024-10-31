import { test } from "node:test";
import { assert } from "chai";
import { selectLocale } from "./locale.ts";

test("select locale", () => {
  const filter =
    (...found: string[]) =>
    (...locales: string[]) =>
      locales.find((locale) => found.includes(locale)) ?? null;
  assert.strictEqual(selectLocale(filter()), "en");
  assert.strictEqual(selectLocale(filter("xx")), "en");
  assert.strictEqual(selectLocale(filter("en")), "en");
  assert.strictEqual(selectLocale(filter("en-US")), "en");
  assert.strictEqual(selectLocale(filter("en-CA")), "en");
  assert.strictEqual(selectLocale(filter("pt")), "pt-br");
  assert.strictEqual(selectLocale(filter("pt-BR")), "pt-br");
  assert.strictEqual(selectLocale(filter("pt-PT")), "pt-pt");
  assert.strictEqual(selectLocale(filter("zh")), "zh-hans");
  assert.strictEqual(selectLocale(filter("zh-CN")), "zh-hans");
  assert.strictEqual(selectLocale(filter("zh-TW")), "zh-hant");
});
