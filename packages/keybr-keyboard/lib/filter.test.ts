import { test } from "node:test";
import { equal } from "rich-assert";
import { allCodePoints, codePointsFrom } from "./fakes.ts";
import { filterText } from "./filter.ts";

test("filter", () => {
  equal(filterText("", allCodePoints()), "");
  equal(filterText("\u0000", allCodePoints()), "");
  equal(filterText(" \t \n \r \u00A0 \u2028 \u2029 ", allCodePoints()), "");
  equal(filterText(" \t \n \r abc \t \n \r ", allCodePoints()), "abc");
  equal(
    filterText(" \t \n \r abc \t \n \r xyz \t \n \r ", allCodePoints()),
    "abc\nxyz",
  );
  equal(filterText("abc", codePointsFrom("")), "");
  equal(filterText("abc", codePointsFrom("ab")), "ab");
  equal(filterText("«abc»", allCodePoints()), "«abc»");
  equal(filterText("«abc»", codePointsFrom("abc")), "abc");
  equal(filterText("abc-def", codePointsFrom("abcdef")), "abc def");
  equal(filterText("abc --- def", codePointsFrom("abcdef")), "abc def");
  equal(filterText("a\u0301", allCodePoints()), "á");
  equal(filterText("a\u0301\u0302\u0303", allCodePoints()), "á");
  equal(filterText("a\u0301", codePointsFrom("a")), "a");
  equal(filterText("ꜳ", codePointsFrom("a")), "aa");
  equal(filterText("ⓐⓑⓒ", codePointsFrom("abc")), "abc");
  equal(filterText("abc こんにちは", allCodePoints()), "abc こんにちは");
  equal(filterText("abc こんにちは", codePointsFrom("abc")), "abc");
  equal(filterText("תפוח, תפוז", allCodePoints()), "תפוח, תפוז");
  equal(filterText("תפוח, תפוז", codePointsFrom("abc")), "");
});
