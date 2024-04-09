import test from "ava";
import { Filter } from "./filter.ts";
import { Letter } from "./letter.ts";

const a = new Letter(0x0061, 0.1, "A");
const b = new Letter(0x0062, 0.2, "B");

test("validates arguments", (t) => {
  t.throws(() => new Filter([], null));
  t.throws(() => new Filter([a], b));
});

test("empty filter includes all characters", (t) => {
  t.true(new Filter(null, null).includes(a.codePoint));
  t.true(new Filter(null, null).includes(b.codePoint));
  t.true(new Filter(null, a).includes(a.codePoint));
  t.true(new Filter(null, a).includes(b.codePoint));
});

test("non empty filter excludes extra characters", (t) => {
  t.true(new Filter([a], null).includes(a.codePoint));
  t.false(new Filter([a], null).includes(b.codePoint));
  t.true(new Filter([a], a).includes(a.codePoint));
  t.false(new Filter([a], a).includes(b.codePoint));
});
