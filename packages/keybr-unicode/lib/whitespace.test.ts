import { test } from "node:test";
import { assert } from "chai";
import { toCodePoints } from "./codepoints.ts";
import { isControl, isLinebreak, isWhitespace } from "./whitespace.ts";

test("classify", () => {
  for (const codePoint of toCodePoints("\n\r\t")) {
    assert.isTrue(isControl(codePoint));
  }
  for (const codePoint of toCodePoints("\n\r\u2028\u2029")) {
    assert.isTrue(isLinebreak(codePoint));
  }
  for (const codePoint of toCodePoints(" \n\r\t\u2028\u2029")) {
    assert.isTrue(isWhitespace(codePoint));
  }
});
