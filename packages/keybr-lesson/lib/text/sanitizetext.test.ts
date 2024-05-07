import { codePointsFrom } from "@keybr/keyboard";
import test from "ava";
import { sanitizeText } from "./sanitizetext.ts";

test("sanitize", (t) => {
  t.is(sanitizeText(""), "");
  t.is(sanitizeText("\u0000"), "");
  t.is(sanitizeText(" \t \n \r \u00A0 \u2028 \u2029 "), "");
  t.is(sanitizeText(" \t \n \r abc \t \n \r "), "abc");
  t.is(sanitizeText(" \t \n \r abc \t \n \r xyz \t \n \r "), "abc\nxyz");
  t.is(sanitizeText("abc", codePointsFrom("")), "");
  t.is(sanitizeText("abc", codePointsFrom("ab")), "ab");
  t.is(sanitizeText("abc", null, codePointsFrom("c")), "ab");
  t.is(sanitizeText("abc", codePointsFrom("abc"), codePointsFrom("abc")), "");
  t.is(sanitizeText("«abc»"), '"abc"');
  t.is(sanitizeText("«abc»", codePointsFrom("abc")), "abc");
  t.is(sanitizeText("a\u0301"), "á");
  t.is(sanitizeText("a\u0301\u0302\u0303"), "á");
  t.is(sanitizeText("a\u0301", codePointsFrom("a")), "a");
  t.is(sanitizeText("a\u0301", codePointsFrom("a"), codePointsFrom("a")), "");
  t.is(sanitizeText("abc リンゴ、オレンジ"), "abc リンゴ、オレンジ");
  t.is(sanitizeText("abc リンゴ、オレンジ", codePointsFrom("abc")), "abc");
  t.is(sanitizeText("תפוח, תפוז"), "תפוח, תפוז");
  t.is(sanitizeText("תפוח, תפוז", codePointsFrom("abc")), "");
});
