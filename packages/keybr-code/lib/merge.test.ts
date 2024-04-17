import test from "ava";
import { type Grammar } from "./ast.ts";
import { merge } from "./merge.ts";

test("single grammar", (t) => {
  const a: Grammar = { rule: { a: "a", x: "1" } };
  t.deepEqual(merge([a], "throw"), a);
});

test("on duplicate replace", (t) => {
  const a: Grammar = { rule: { a: "a", x: "1" } };
  const b: Grammar = { rule: { b: "b", x: "2" } };
  t.deepEqual(merge([a, b], "replace"), {
    rule: { a: "a", b: "b", x: "2" },
  });
  t.deepEqual(merge([b, a], "replace"), {
    rule: { a: "a", b: "b", x: "1" },
  });
});

test("on duplicate throws", (t) => {
  const a: Grammar = { rule: { x: "1" } };
  const b: Grammar = { rule: { x: "2" } };
  t.throws(
    () => {
      merge([a, a], "throw");
    },
    {
      message: 'Duplicate rule "x"',
    },
  );
  t.throws(
    () => {
      merge([a, b], "throw");
    },
    {
      message: 'Duplicate rule "x"',
    },
  );
});
