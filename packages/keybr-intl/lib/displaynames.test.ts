import { test } from "node:test";
import { assert } from "chai";
import { createIntl } from "react-intl";
import { makeIntlDisplayNames } from "./displaynames.ts";
import { allLocales } from "./locale.ts";

test("unique instance", () => {
  const intl = createIntl({ locale: "en-US" });
  const a = makeIntlDisplayNames(intl);
  const b = makeIntlDisplayNames(intl);

  assert.strictEqual(a, b);
});

test("format region name en-US", () => {
  const { formatRegionName } = makeIntlDisplayNames(
    createIntl({ locale: "en-US" }),
  );

  assert.strictEqual(formatRegionName("DE"), "Germany");
  assert.strictEqual(formatRegionName("FR"), "France");
});

test("format region name pl-PL", () => {
  const { formatRegionName } = makeIntlDisplayNames(
    createIntl({ locale: "pl-PL" }),
  );

  assert.strictEqual(formatRegionName("DE"), "Niemcy");
  assert.strictEqual(formatRegionName("FR"), "Francja");
});

test("format language name en-US", () => {
  const { formatLanguageName, formatLocalLanguageName } = makeIntlDisplayNames(
    createIntl({ locale: "en-US" }),
  );

  assert.strictEqual(formatLanguageName("en"), "English");
  assert.strictEqual(formatLocalLanguageName("en"), "English");
  assert.strictEqual(formatLanguageName("de"), "German");
  assert.strictEqual(formatLocalLanguageName("de"), "Deutsch");
  assert.strictEqual(formatLanguageName("fr"), "French");
  assert.strictEqual(formatLocalLanguageName("fr"), "Français");
  assert.strictEqual(formatLanguageName("pt-BR"), "Brazilian Portuguese");
  assert.strictEqual(formatLocalLanguageName("pt-BR"), "Português (Brasil)");
  assert.strictEqual(
    formatLanguageName("zh-Hans-CN"),
    "Chinese (Simplified, China)",
  );
  assert.strictEqual(
    formatLocalLanguageName("zh-Hans-CN"),
    "中文（简体，中国）",
  );
});

test("format language name pl-PL", () => {
  const { formatLanguageName, formatLocalLanguageName } = makeIntlDisplayNames(
    createIntl({ locale: "pl-PL" }),
  );

  assert.strictEqual(formatLanguageName("en"), "Angielski");
  assert.strictEqual(formatLocalLanguageName("en"), "English");
  assert.strictEqual(formatLanguageName("de"), "Niemiecki");
  assert.strictEqual(formatLocalLanguageName("de"), "Deutsch");
  assert.strictEqual(formatLanguageName("fr"), "Francuski");
  assert.strictEqual(formatLocalLanguageName("fr"), "Français");
  assert.strictEqual(formatLanguageName("pt-BR"), "Brazylijski Portugalski");
  assert.strictEqual(formatLocalLanguageName("pt-BR"), "Português (Brasil)");
  assert.strictEqual(
    formatLanguageName("zh-Hans-CN"),
    "Chiński (Uproszczone, Chiny)",
  );
  assert.strictEqual(
    formatLocalLanguageName("zh-Hans-CN"),
    "中文（简体，中国）",
  );
});

test("format all language names in all locales", () => {
  for (const outer of allLocales) {
    const { formatLanguageName } = makeIntlDisplayNames(
      createIntl({ locale: outer }),
    );
    for (const inner of allLocales) {
      assert.isAbove(formatLanguageName(inner).length, 0);
    }
  }
});
