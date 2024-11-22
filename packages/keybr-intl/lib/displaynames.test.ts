import { test } from "node:test";
import { createIntl } from "react-intl";
import { equal, isNotEmpty } from "rich-assert";
import { makeIntlDisplayNames } from "./displaynames.ts";
import { allLocales } from "./locale.ts";

test("unique instance", () => {
  const intl = createIntl({ locale: "en-US" });
  const a = makeIntlDisplayNames(intl);
  const b = makeIntlDisplayNames(intl);

  equal(a, b);
});

test("format region name en-US", () => {
  const { formatRegionName } = makeIntlDisplayNames(
    createIntl({ locale: "en-US" }),
  );

  equal(formatRegionName("DE"), "Germany");
  equal(formatRegionName("FR"), "France");
});

test("format region name pl-PL", () => {
  const { formatRegionName } = makeIntlDisplayNames(
    createIntl({ locale: "pl-PL" }),
  );

  equal(formatRegionName("DE"), "Niemcy");
  equal(formatRegionName("FR"), "Francja");
});

test("format language name en-US", () => {
  const { formatLanguageName, formatLocalLanguageName } = makeIntlDisplayNames(
    createIntl({ locale: "en-US" }),
  );

  equal(formatLanguageName("en"), "English");
  equal(formatLocalLanguageName("en"), "English");
  equal(formatLanguageName("de"), "German");
  equal(formatLocalLanguageName("de"), "Deutsch");
  equal(formatLanguageName("fr"), "French");
  equal(formatLocalLanguageName("fr"), "Français");
  equal(formatLanguageName("pt-BR"), "Brazilian Portuguese");
  equal(formatLocalLanguageName("pt-BR"), "Português (Brasil)");
  equal(formatLanguageName("zh-Hans-CN"), "Chinese (Simplified, China)");
  equal(formatLocalLanguageName("zh-Hans-CN"), "中文（简体，中国）");
});

test("format language name pl-PL", () => {
  const { formatLanguageName, formatLocalLanguageName } = makeIntlDisplayNames(
    createIntl({ locale: "pl-PL" }),
  );

  equal(formatLanguageName("en"), "Angielski");
  equal(formatLocalLanguageName("en"), "English");
  equal(formatLanguageName("de"), "Niemiecki");
  equal(formatLocalLanguageName("de"), "Deutsch");
  equal(formatLanguageName("fr"), "Francuski");
  equal(formatLocalLanguageName("fr"), "Français");
  equal(formatLanguageName("pt-BR"), "Brazylijski Portugalski");
  equal(formatLocalLanguageName("pt-BR"), "Português (Brasil)");
  equal(formatLanguageName("zh-Hans-CN"), "Chiński (Uproszczone, Chiny)");
  equal(formatLocalLanguageName("zh-Hans-CN"), "中文（简体，中国）");
});

test("format all language names in all locales", () => {
  for (const outer of allLocales) {
    const { formatLanguageName } = makeIntlDisplayNames(
      createIntl({ locale: outer }),
    );
    for (const inner of allLocales) {
      isNotEmpty(formatLanguageName(inner));
    }
  }
});
