import test from "ava";
import { allLocales } from "./locale.ts";

test("all locales", (t) => {
  for (const id of allLocales) {
    t.notThrows(() => {
      new Intl.Locale(id);
    });
  }
});
