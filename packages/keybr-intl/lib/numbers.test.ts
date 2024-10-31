import { test } from "node:test";
import { assert } from "chai";
import { createIntl } from "react-intl";
import { makeIntlNumbers } from "./numbers.ts";

test("unique instance", () => {
  const intl = createIntl({ locale: "en-US" });
  const a = makeIntlNumbers(intl);
  const b = makeIntlNumbers(intl);

  assert.strictEqual(a, b);
});

test("format integer", () => {
  const { formatInteger } = makeIntlNumbers(createIntl({ locale: "en-US" }));

  assert.strictEqual(formatInteger(123.456), "123");
  assert.strictEqual(formatInteger(123.789), "124");
});

test("format number", () => {
  const { formatNumber } = makeIntlNumbers(createIntl({ locale: "en-US" }));

  assert.strictEqual(formatNumber(999.123456), "999.123");
  assert.strictEqual(formatNumber(999.123456, 1), "999.1");
  assert.strictEqual(formatNumber(999.123456, 2), "999.12");
  assert.strictEqual(formatNumber(999.123456, 3), "999.123");
});

test("format percents", () => {
  const { formatPercents } = makeIntlNumbers(createIntl({ locale: "en-US" }));

  assert.strictEqual(formatPercents(0.99123456), "99.12%");
  assert.strictEqual(formatPercents(0.99123456, 1), "99.1%");
  assert.strictEqual(formatPercents(0.99123456, 2), "99.12%");
  assert.strictEqual(formatPercents(0.99123456, 3), "99.123%");
  assert.strictEqual(formatPercents(0.999, 0), "99.9%");
  assert.strictEqual(formatPercents(0.9999, 0), "99.99%");
  assert.strictEqual(formatPercents(0.99999, 0), "99.999%");
  assert.strictEqual(formatPercents(0.999999, 0), "99.9999%");
  assert.strictEqual(formatPercents(0.9999999, 0), "99.99999%");
  assert.strictEqual(formatPercents(0.99999999, 0), "99.999999%");
  assert.strictEqual(formatPercents(0.999999999, 0), "100%");
  assert.strictEqual(formatPercents(1.0), "100%");
  assert.strictEqual(formatPercents(1.0, 0), "100%");
  assert.strictEqual(formatPercents(1.0, 1), "100%");
  assert.strictEqual(formatPercents(2.0), "200%");
  assert.strictEqual(formatPercents(2.0, 0), "200%");
  assert.strictEqual(formatPercents(2.0, 1), "200%");
});
