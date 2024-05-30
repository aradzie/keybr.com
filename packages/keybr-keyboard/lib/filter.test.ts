import test from "ava";
import { allCodePoints, codePointsFrom } from "./fakes.ts";
import { filterText } from "./filter.ts";

test("filter", (t) => {
  t.is(filterText("", allCodePoints()), "");
  t.is(filterText("\u0000", allCodePoints()), "");
  t.is(filterText(" \t \n \r \u00A0 \u2028 \u2029 ", allCodePoints()), "");
  t.is(filterText(" \t \n \r abc \t \n \r ", allCodePoints()), "abc");
  t.is(
    filterText(" \t \n \r abc \t \n \r xyz \t \n \r ", allCodePoints()),
    "abc\nxyz",
  );
  t.is(filterText("abc", codePointsFrom("")), "");
  t.is(filterText("abc", codePointsFrom("ab")), "ab");
  t.is(filterText("«abc»", allCodePoints()), "«abc»");
  t.is(filterText("«abc»", codePointsFrom("abc")), "abc");
  t.is(filterText("abc-def", codePointsFrom("abcdef")), "abc def");
  t.is(filterText("abc --- def", codePointsFrom("abcdef")), "abc def");
  t.is(filterText("a\u0301", allCodePoints()), "á");
  t.is(filterText("a\u0301\u0302\u0303", allCodePoints()), "á");
  t.is(filterText("a\u0301", codePointsFrom("a")), "a");
  t.is(filterText("ꜳ", codePointsFrom("a")), "aa");
  t.is(filterText("ⓐⓑⓒ", codePointsFrom("abc")), "abc");
  t.is(filterText("abc こんにちは", allCodePoints()), "abc こんにちは");
  t.is(filterText("abc こんにちは", codePointsFrom("abc")), "abc");
  t.is(filterText("תפוח, תפוז", allCodePoints()), "תפוח, תפוז");
  t.is(filterText("תפוח, תפוז", codePointsFrom("abc")), "");
});
