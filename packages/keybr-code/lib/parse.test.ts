import { test } from "node:test";
import { deepEqual } from "rich-assert";
import { parse } from "./parse.ts";

test("parse empty", () => {
  deepEqual(parse(``), {});
  deepEqual(parse(` `), {});
});

test("parse literal", () => {
  deepEqual(parse(`start -> "";`), { start: "" });
  deepEqual(parse(`start -> "abc";`), { start: "abc" });
  deepEqual(parse(`start -> "\\"abc\\"";`), { start: '"abc"' });
  deepEqual(parse(`start -> "\\u0061\\u0062\\u0063";`), {
    start: "abc",
  });
});

test("parse ref", () => {
  deepEqual(parse(`start -> id;`), { start: { ref: "id" } });
});

test("parse opt", () => {
  deepEqual(parse(`start -> [ "a" ];`), {
    start: { f: 0.5, opt: "a" },
  });
});

test("parse seq", () => {
  deepEqual(parse(`start -> "a" "b" "c";`), {
    start: { seq: ["a", "b", "c"] },
  });
});

test("parse alt", () => {
  deepEqual(parse(`start -> "a" | "b" | "c";`), {
    start: { alt: ["a", "b", "c"] },
  });
});

test("parse cond", () => {
  deepEqual(parse(`start -> { :if(f1) "a" "b" "c" };`), {
    start: { flag: "f1", inv: false, cond: { seq: ["a", "b", "c"] } },
  });
  deepEqual(parse(`start -> { :if(f1) "a" | "b" | "c" };`), {
    start: { flag: "f1", inv: false, cond: { alt: ["a", "b", "c"] } },
  });
  deepEqual(parse(`start -> { :if(!f1) "a" "b" "c" };`), {
    start: { flag: "f1", inv: true, cond: { seq: ["a", "b", "c"] } },
  });
  deepEqual(parse(`start -> { :if(!f1) "a" | "b" | "c" };`), {
    start: { flag: "f1", inv: true, cond: { alt: ["a", "b", "c"] } },
  });
});

test("parse span", () => {
  deepEqual(parse(`start -> { :class(c1) "a" "b" "c" };`), {
    start: { cls: "c1", span: { seq: ["a", "b", "c"] } },
  });
  deepEqual(parse(`start -> { :class(c1) "a" | "b" | "c" };`), {
    start: { cls: "c1", span: { alt: ["a", "b", "c"] } },
  });
});

test("priorities", () => {
  deepEqual(parse(`start -> ("a" | "b") "c";`), {
    start: { seq: [{ alt: ["a", "b"] }, "c"] },
  });
  deepEqual(parse(`start -> "a" ("b" | "c");`), {
    start: { seq: ["a", { alt: ["b", "c"] }] },
  });
  deepEqual(parse(`start -> ( ( "a" | ( "b" | "c" ) ) );`), {
    start: { alt: ["a", { alt: ["b", "c"] }] },
  });
  deepEqual(parse(`start -> [("a" | "b") "c"];`), {
    start: { f: 0.5, opt: { seq: [{ alt: ["a", "b"] }, "c"] } },
  });
  deepEqual(parse(`start -> (["a" | "b"]) "c";`), {
    start: { seq: [{ f: 0.5, opt: { alt: ["a", "b"] } }, "c"] },
  });
  deepEqual(parse(`start -> (["a"] | "b") "c";`), {
    start: { seq: [{ alt: [{ f: 0.5, opt: "a" }, "b"] }, "c"] },
  });
});

test("parse rules", () => {
  deepEqual(parse(` a -> "a" ; b -> "b" ; `), {
    a: "a",
    b: "b",
  });
});
