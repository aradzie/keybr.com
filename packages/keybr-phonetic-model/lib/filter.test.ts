import { test } from "node:test";
import { assert } from "chai";
import { Filter } from "./filter.ts";
import { Letter } from "./letter.ts";

const a = new Letter(0x0061, 0.1, "A");
const b = new Letter(0x0062, 0.2, "B");

test("validates arguments", () => {
  assert.throws(() => new Filter([], null));
  assert.throws(() => new Filter([a], b));
});

test("empty filter includes all characters", () => {
  assert.isTrue(new Filter(null, null).includes(a.codePoint));
  assert.isTrue(new Filter(null, null).includes(b.codePoint));
  assert.isTrue(new Filter(null, a).includes(a.codePoint));
  assert.isTrue(new Filter(null, a).includes(b.codePoint));
});

test("non empty filter excludes extra characters", () => {
  assert.isTrue(new Filter([a], null).includes(a.codePoint));
  assert.isFalse(new Filter([a], null).includes(b.codePoint));
  assert.isTrue(new Filter([a], a).includes(a.codePoint));
  assert.isFalse(new Filter([a], a).includes(b.codePoint));
});
