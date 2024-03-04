import test from "ava";
import { createIntl } from "react-intl";
import { makeIntlDisplayNames } from "./displaynames.ts";
import { allLocales } from "./locale.ts";

test("unique instance", (t) => {
  const intl = createIntl({ locale: "en-US" });
  const a = makeIntlDisplayNames(intl);
  const b = makeIntlDisplayNames(intl);

  t.true(a === b);
});

test("format region name en-US", (t) => {
  const { formatRegionName } = makeIntlDisplayNames(
    createIntl({ locale: "en-US" }),
  );

  t.is(formatRegionName("DE"), "Germany");
  t.is(formatRegionName("FR"), "France");
});

test("format region name pl-PL", (t) => {
  const { formatRegionName } = makeIntlDisplayNames(
    createIntl({ locale: "pl-PL" }),
  );

  t.is(formatRegionName("DE"), "Niemcy");
  t.is(formatRegionName("FR"), "Francja");
});

test("format language name en-US", (t) => {
  const { formatLanguageName, formatLocalLanguageName } = makeIntlDisplayNames(
    createIntl({ locale: "en-US" }),
  );

  t.is(formatLanguageName("en"), "English");
  t.is(formatLocalLanguageName("en"), "English");
  t.is(formatLanguageName("de"), "German");
  t.is(formatLocalLanguageName("de"), "Deutsch");
  t.is(formatLanguageName("fr"), "French");
  t.is(formatLocalLanguageName("fr"), "Français");
});

test("format language name pl-PL", (t) => {
  const { formatLanguageName, formatLocalLanguageName } = makeIntlDisplayNames(
    createIntl({ locale: "pl-PL" }),
  );

  t.is(formatLanguageName("en"), "Angielski");
  t.is(formatLocalLanguageName("en"), "English");
  t.is(formatLanguageName("de"), "Niemiecki");
  t.is(formatLocalLanguageName("de"), "Deutsch");
  t.is(formatLanguageName("fr"), "Francuski");
  t.is(formatLocalLanguageName("fr"), "Français");
});

test("format all language names in all locales", (t) => {
  for (const outer of allLocales) {
    const { formatLanguageName } = makeIntlDisplayNames(
      createIntl({ locale: outer }),
    );
    for (const inner of allLocales) {
      t.true(formatLanguageName(inner).length > 0);
    }
  }
});
