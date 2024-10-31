import { test } from "node:test";
import { assert } from "chai";
import { allCodePoints, codePointsFrom } from "./fakes.ts";
import { filterText } from "./filter.ts";

test("filter", () => {
  assert.strictEqual(filterText("", allCodePoints()), "");
  assert.strictEqual(filterText("\u0000", allCodePoints()), "");
  assert.strictEqual(
    filterText(" \t \n \r \u00A0 \u2028 \u2029 ", allCodePoints()),
    "",
  );
  assert.strictEqual(
    filterText(" \t \n \r abc \t \n \r ", allCodePoints()),
    "abc",
  );
  assert.strictEqual(
    filterText(" \t \n \r abc \t \n \r xyz \t \n \r ", allCodePoints()),
    "abc\nxyz",
  );
  assert.strictEqual(filterText("abc", codePointsFrom("")), "");
  assert.strictEqual(filterText("abc", codePointsFrom("ab")), "ab");
  assert.strictEqual(filterText("«abc»", allCodePoints()), "«abc»");
  assert.strictEqual(filterText("«abc»", codePointsFrom("abc")), "abc");
  assert.strictEqual(
    filterText("abc-def", codePointsFrom("abcdef")),
    "abc def",
  );
  assert.strictEqual(
    filterText("abc --- def", codePointsFrom("abcdef")),
    "abc def",
  );
  assert.strictEqual(filterText("a\u0301", allCodePoints()), "á");
  assert.strictEqual(filterText("a\u0301\u0302\u0303", allCodePoints()), "á");
  assert.strictEqual(filterText("a\u0301", codePointsFrom("a")), "a");
  assert.strictEqual(filterText("ꜳ", codePointsFrom("a")), "aa");
  assert.strictEqual(filterText("ⓐⓑⓒ", codePointsFrom("abc")), "abc");
  assert.strictEqual(
    filterText("abc こんにちは", allCodePoints()),
    "abc こんにちは",
  );
  assert.strictEqual(
    filterText("abc こんにちは", codePointsFrom("abc")),
    "abc",
  );
  assert.strictEqual(filterText("תפוח, תפוז", allCodePoints()), "תפוח, תפוז");
  assert.strictEqual(filterText("תפוח, תפוז", codePointsFrom("abc")), "");
});
