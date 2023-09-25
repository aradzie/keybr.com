import test from "ava";
import { languageName } from "./languages.ts";
import { allLocales } from "./locale.ts";

test("language name", (t) => {
  for (const locale of allLocales) {
    t.like(languageName(locale), { id: `language.${locale}.name` });
  }
});
