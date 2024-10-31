import { test } from "node:test";
import { assert } from "chai";
import { createIntl } from "react-intl";
import { makeIntlCollator } from "./collator.ts";

test("unique instance", () => {
  const intl = createIntl({ locale: "en-US" });
  const a = makeIntlCollator(intl);
  const b = makeIntlCollator(intl);

  assert.strictEqual(a, b);
});
