import { test } from "node:test";
import { assert } from "chai";
import {
  Attr,
  charsAreEqual,
  flattenStyledText,
  splitStyledText,
} from "./chars.ts";

test("flatten styled text", () => {
  assert.strictEqual(flattenStyledText("abc"), "abc");
  assert.strictEqual(flattenStyledText([["abc"]]), "abc");
  assert.strictEqual(flattenStyledText([{ text: "xyz", cls: "c1" }]), "xyz");
  assert.strictEqual(
    flattenStyledText([["abc"], [{ text: "xyz", cls: "c1" }]]),
    "abcxyz",
  );
});

test("split styled text", () => {
  assert.deepStrictEqual(splitStyledText("abc"), [
    { codePoint: 0x0061, attrs: Attr.Normal, cls: null },
    { codePoint: 0x0062, attrs: Attr.Normal, cls: null },
    { codePoint: 0x0063, attrs: Attr.Normal, cls: null },
  ]);
  assert.deepStrictEqual(splitStyledText([["abc"]]), [
    { codePoint: 0x0061, attrs: Attr.Normal, cls: null },
    { codePoint: 0x0062, attrs: Attr.Normal, cls: null },
    { codePoint: 0x0063, attrs: Attr.Normal, cls: null },
  ]);
  assert.deepStrictEqual(splitStyledText([[{ text: "xyz", cls: "c1" }]]), [
    { codePoint: 0x0078, attrs: Attr.Normal, cls: "c1" },
    { codePoint: 0x0079, attrs: Attr.Normal, cls: "c1" },
    { codePoint: 0x007a, attrs: Attr.Normal, cls: "c1" },
  ]);
  assert.deepStrictEqual(
    splitStyledText([["abc"], [{ text: "xyz", cls: "c1" }]]),
    [
      { codePoint: 0x0061, attrs: Attr.Normal, cls: null },
      { codePoint: 0x0062, attrs: Attr.Normal, cls: null },
      { codePoint: 0x0063, attrs: Attr.Normal, cls: null },
      { codePoint: 0x0078, attrs: Attr.Normal, cls: "c1" },
      { codePoint: 0x0079, attrs: Attr.Normal, cls: "c1" },
      { codePoint: 0x007a, attrs: Attr.Normal, cls: "c1" },
    ],
  );
});

test("equal chars", () => {
  assert.isTrue(
    charsAreEqual(
      { codePoint: 0x0061, attrs: Attr.Normal, cls: "c1" },
      { codePoint: 0x0061, attrs: Attr.Normal, cls: "c1" },
    ),
  );
  assert.isFalse(
    charsAreEqual(
      { codePoint: 0x0061, attrs: Attr.Normal, cls: "c1" },
      { codePoint: 0x0062, attrs: Attr.Normal, cls: "c1" },
    ),
  );
  assert.isFalse(
    charsAreEqual(
      { codePoint: 0x0061, attrs: Attr.Normal, cls: "c1" },
      { codePoint: 0x0061, attrs: Attr.Hit, cls: "c1" },
    ),
  );
  assert.isFalse(
    charsAreEqual(
      { codePoint: 0x0061, attrs: Attr.Normal, cls: "c1" },
      { codePoint: 0x0061, attrs: Attr.Normal, cls: "c2" },
    ),
  );
});
