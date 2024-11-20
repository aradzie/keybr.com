import { test } from "node:test";
import { isTrue } from "rich-assert";
import { toCodePoints } from "./codepoints.ts";
import { isControl, isLinebreak, isWhitespace } from "./whitespace.ts";

test("classify", () => {
  for (const codePoint of toCodePoints("\n\r\t")) {
    isTrue(isControl(codePoint));
  }
  for (const codePoint of toCodePoints("\n\r\u2028\u2029")) {
    isTrue(isLinebreak(codePoint));
  }
  for (const codePoint of toCodePoints(" \n\r\t\u2028\u2029")) {
    isTrue(isWhitespace(codePoint));
  }
});
