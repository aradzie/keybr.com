import test from "ava";
import { toCodePoints } from "./codepoints.ts";
import { isControl, isLinebreak, isWhitespace } from "./whitespace.ts";

test("classify", (t) => {
  for (const codePoint of toCodePoints("\n\r\t")) {
    t.true(isControl(codePoint));
  }
  for (const codePoint of toCodePoints("\n\r\u2028\u2029")) {
    t.true(isLinebreak(codePoint));
  }
  for (const codePoint of toCodePoints(" \n\r\t\u2028\u2029")) {
    t.true(isWhitespace(codePoint));
  }
});
