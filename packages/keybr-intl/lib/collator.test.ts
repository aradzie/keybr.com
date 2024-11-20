import { test } from "node:test";
import { createIntl } from "react-intl";
import { equal } from "rich-assert";
import { makeIntlCollator } from "./collator.ts";

test("unique instance", () => {
  const intl = createIntl({ locale: "en-US" });
  const a = makeIntlCollator(intl);
  const b = makeIntlCollator(intl);

  equal(a, b);
});
