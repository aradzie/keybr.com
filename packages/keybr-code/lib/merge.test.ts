import test from "ava";
import { type Rules } from "./ast.ts";
import { merge } from "./merge.ts";

test("single grammar", (t) => {
  const a = { a: "a", x: "1" } satisfies Rules;
  t.deepEqual(merge([a], "throw"), a);
});

test("on duplicate replace", (t) => {
  const a = { a: "a", x: "1" } satisfies Rules;
  const b = { b: "b", x: "2" } satisfies Rules;
  t.deepEqual(merge([a, b], "replace"), {
    a: "a",
    b: "b",
    x: "2",
  });
  t.deepEqual(merge([b, a], "replace"), {
    a: "a",
    b: "b",
    x: "1",
  });
});

test("on duplicate throws", (t) => {
  const a = { x: "1" } satisfies Rules;
  const b = { x: "2" } satisfies Rules;
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
