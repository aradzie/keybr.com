import test from "ava";
import { charsAreEqual, flattenStyledText, splitStyledText } from "./chars.ts";
import { Attr } from "./types.ts";

test("flatten styled text", (t) => {
  t.is(flattenStyledText("abc"), "abc");
  t.is(flattenStyledText([["abc"]]), "abc");
  t.is(flattenStyledText([{ text: "xyz", cls: "c1" }]), "xyz");
  t.is(flattenStyledText([["abc"], [{ text: "xyz", cls: "c1" }]]), "abcxyz");
});

test("split styled text", (t) => {
  t.deepEqual(splitStyledText("abc"), [
    { codePoint: 0x0061, attrs: Attr.Normal, cls: null },
    { codePoint: 0x0062, attrs: Attr.Normal, cls: null },
    { codePoint: 0x0063, attrs: Attr.Normal, cls: null },
  ]);
  t.deepEqual(splitStyledText([["abc"]]), [
    { codePoint: 0x0061, attrs: Attr.Normal, cls: null },
    { codePoint: 0x0062, attrs: Attr.Normal, cls: null },
    { codePoint: 0x0063, attrs: Attr.Normal, cls: null },
  ]);
  t.deepEqual(splitStyledText([[{ text: "xyz", cls: "c1" }]]), [
    { codePoint: 0x0078, attrs: Attr.Normal, cls: "c1" },
    { codePoint: 0x0079, attrs: Attr.Normal, cls: "c1" },
    { codePoint: 0x007a, attrs: Attr.Normal, cls: "c1" },
  ]);
  t.deepEqual(splitStyledText([["abc"], [{ text: "xyz", cls: "c1" }]]), [
    { codePoint: 0x0061, attrs: Attr.Normal, cls: null },
    { codePoint: 0x0062, attrs: Attr.Normal, cls: null },
    { codePoint: 0x0063, attrs: Attr.Normal, cls: null },
    { codePoint: 0x0078, attrs: Attr.Normal, cls: "c1" },
    { codePoint: 0x0079, attrs: Attr.Normal, cls: "c1" },
    { codePoint: 0x007a, attrs: Attr.Normal, cls: "c1" },
  ]);
});

test("equal chars", (t) => {
  t.true(
    charsAreEqual(
      { codePoint: 0x0061, attrs: Attr.Normal, cls: "c1" },
      { codePoint: 0x0061, attrs: Attr.Normal, cls: "c1" },
    ),
  );
  t.false(
    charsAreEqual(
      { codePoint: 0x0061, attrs: Attr.Normal, cls: "c1" },
      { codePoint: 0x0062, attrs: Attr.Normal, cls: "c1" },
    ),
  );
  t.false(
    charsAreEqual(
      { codePoint: 0x0061, attrs: Attr.Normal, cls: "c1" },
      { codePoint: 0x0061, attrs: Attr.Hit, cls: "c1" },
    ),
  );
  t.false(
    charsAreEqual(
      { codePoint: 0x0061, attrs: Attr.Normal, cls: "c1" },
      { codePoint: 0x0061, attrs: Attr.Normal, cls: "c2" },
    ),
  );
});
