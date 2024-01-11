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
  const { formatLanguageName } = makeIntlDisplayNames(
    createIntl({ locale: "en-US" }),
  );

  t.is(formatLanguageName("en"), "English");
  t.is(formatLanguageName("de"), "German (Deutsch)");
  t.is(formatLanguageName("fr"), "French (Français)");
});

test("format language name pl-PL", (t) => {
  const { formatLanguageName } = makeIntlDisplayNames(
    createIntl({ locale: "pl-PL" }),
  );

  t.is(formatLanguageName("en"), "Angielski (English)");
  t.is(formatLanguageName("de"), "Niemiecki (Deutsch)");
  t.is(formatLanguageName("fr"), "Francuski (Français)");
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
