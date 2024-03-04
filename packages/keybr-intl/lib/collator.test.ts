import test from "ava";
import { createIntl } from "react-intl";
import { makeIntlCollator } from "./collator.ts";

test("unique instance", (t) => {
  const intl = createIntl({ locale: "en-US" });
  const a = makeIntlCollator(intl);
  const b = makeIntlCollator(intl);

  t.true(a === b);
});
