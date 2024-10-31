import { test } from "node:test";
import { assert } from "chai";
import { parse } from "./parse.ts";

test("parse empty", () => {
  assert.deepStrictEqual(parse(``), {});
  assert.deepStrictEqual(parse(` `), {});
});

test("parse literal", () => {
  assert.deepStrictEqual(parse(`start -> "";`), { start: "" });
  assert.deepStrictEqual(parse(`start -> "abc";`), { start: "abc" });
  assert.deepStrictEqual(parse(`start -> "\\"abc\\"";`), { start: '"abc"' });
  assert.deepStrictEqual(parse(`start -> "\\u0061\\u0062\\u0063";`), {
    start: "abc",
  });
});

test("parse ref", () => {
  assert.deepStrictEqual(parse(`start -> id;`), { start: { ref: "id" } });
});

test("parse opt", () => {
  assert.deepStrictEqual(parse(`start -> [ "a" ];`), {
    start: { f: 0.5, opt: "a" },
  });
});

test("parse seq", () => {
  assert.deepStrictEqual(parse(`start -> "a" "b" "c";`), {
    start: { seq: ["a", "b", "c"] },
  });
});

test("parse alt", () => {
  assert.deepStrictEqual(parse(`start -> "a" | "b" | "c";`), {
    start: { alt: ["a", "b", "c"] },
  });
});

test("parse cond", () => {
  assert.deepStrictEqual(parse(`start -> { :if(f1) "a" "b" "c" };`), {
    start: { flag: "f1", inv: false, cond: { seq: ["a", "b", "c"] } },
  });
  assert.deepStrictEqual(parse(`start -> { :if(f1) "a" | "b" | "c" };`), {
    start: { flag: "f1", inv: false, cond: { alt: ["a", "b", "c"] } },
  });
  assert.deepStrictEqual(parse(`start -> { :if(!f1) "a" "b" "c" };`), {
    start: { flag: "f1", inv: true, cond: { seq: ["a", "b", "c"] } },
  });
  assert.deepStrictEqual(parse(`start -> { :if(!f1) "a" | "b" | "c" };`), {
    start: { flag: "f1", inv: true, cond: { alt: ["a", "b", "c"] } },
  });
});

test("parse span", () => {
  assert.deepStrictEqual(parse(`start -> { :class(c1) "a" "b" "c" };`), {
    start: { cls: "c1", span: { seq: ["a", "b", "c"] } },
  });
  assert.deepStrictEqual(parse(`start -> { :class(c1) "a" | "b" | "c" };`), {
    start: { cls: "c1", span: { alt: ["a", "b", "c"] } },
  });
});

test("priorities", () => {
  assert.deepStrictEqual(parse(`start -> ("a" | "b") "c";`), {
    start: { seq: [{ alt: ["a", "b"] }, "c"] },
  });
  assert.deepStrictEqual(parse(`start -> "a" ("b" | "c");`), {
    start: { seq: ["a", { alt: ["b", "c"] }] },
  });
  assert.deepStrictEqual(parse(`start -> ( ( "a" | ( "b" | "c" ) ) );`), {
    start: { alt: ["a", { alt: ["b", "c"] }] },
  });
  assert.deepStrictEqual(parse(`start -> [("a" | "b") "c"];`), {
    start: { f: 0.5, opt: { seq: [{ alt: ["a", "b"] }, "c"] } },
  });
  assert.deepStrictEqual(parse(`start -> (["a" | "b"]) "c";`), {
    start: { seq: [{ f: 0.5, opt: { alt: ["a", "b"] } }, "c"] },
  });
  assert.deepStrictEqual(parse(`start -> (["a"] | "b") "c";`), {
    start: { seq: [{ alt: [{ f: 0.5, opt: "a" }, "b"] }, "c"] },
  });
});

test("parse rules", () => {
  assert.deepStrictEqual(parse(` a -> "a" ; b -> "b" ; `), {
    a: "a",
    b: "b",
  });
});
