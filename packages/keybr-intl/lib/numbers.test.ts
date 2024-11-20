import { test } from "node:test";
import { createIntl } from "react-intl";
import { equal } from "rich-assert";
import { makeIntlNumbers } from "./numbers.ts";

test("unique instance", () => {
  const intl = createIntl({ locale: "en-US" });
  const a = makeIntlNumbers(intl);
  const b = makeIntlNumbers(intl);

  equal(a, b);
});

test("format integer", () => {
  const { formatInteger } = makeIntlNumbers(createIntl({ locale: "en-US" }));

  equal(formatInteger(123.456), "123");
  equal(formatInteger(123.789), "124");
});

test("format number", () => {
  const { formatNumber } = makeIntlNumbers(createIntl({ locale: "en-US" }));

  equal(formatNumber(999.123456), "999.123");
  equal(formatNumber(999.123456, 1), "999.1");
  equal(formatNumber(999.123456, 2), "999.12");
  equal(formatNumber(999.123456, 3), "999.123");
});

test("format percents", () => {
  const { formatPercents } = makeIntlNumbers(createIntl({ locale: "en-US" }));

  equal(formatPercents(0.99123456), "99.12%");
  equal(formatPercents(0.99123456, 1), "99.1%");
  equal(formatPercents(0.99123456, 2), "99.12%");
  equal(formatPercents(0.99123456, 3), "99.123%");
  equal(formatPercents(0.999, 0), "99.9%");
  equal(formatPercents(0.9999, 0), "99.99%");
  equal(formatPercents(0.99999, 0), "99.999%");
  equal(formatPercents(0.999999, 0), "99.9999%");
  equal(formatPercents(0.9999999, 0), "99.99999%");
  equal(formatPercents(0.99999999, 0), "99.999999%");
  equal(formatPercents(0.999999999, 0), "100%");
  equal(formatPercents(1.0), "100%");
  equal(formatPercents(1.0, 0), "100%");
  equal(formatPercents(1.0, 1), "100%");
  equal(formatPercents(2.0), "200%");
  equal(formatPercents(2.0, 0), "200%");
  equal(formatPercents(2.0, 1), "200%");
});
