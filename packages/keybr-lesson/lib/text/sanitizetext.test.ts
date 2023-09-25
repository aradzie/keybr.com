import { toCodePoints } from "@keybr/unicode";
import test from "ava";
import { sanitizeText } from "./sanitizetext.ts";

test("sanitize", (t) => {
  t.is(sanitizeText(" \t \n \r \u0000 \u00A0 \u2028 \u2029 ", new Set()), "");
  t.is(sanitizeText(" \t \n \r hello \t \n \r "), "hello");
  t.is(
    sanitizeText(" \t \n \r hello \t \n \r world \t \n \r "),
    "hello\nworld",
  );
  t.is(sanitizeText("hello", new Set(toCodePoints("eho"))), "heo");
  t.is(sanitizeText("hello", null, new Set(toCodePoints("eho"))), "ll");
  t.is(
    sanitizeText(
      "hello",
      new Set(toCodePoints("ehlo")),
      new Set(toCodePoints("eho")),
    ),
    "ll",
  );
  t.is(sanitizeText("«hello»"), '"hello"');
  t.is(sanitizeText("\u0061\u0301"), "\u00e1");
});
