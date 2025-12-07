import { test } from "node:test";
import { deepEqual } from "rich-assert";
import { type Grammar } from "./ast.ts";
import { flagSet } from "./flags.ts";
import { pruneCond } from "./prune.ts";

test("no conditional prods", () => {
  deepEqual(
    pruneCond(
      {
        rules: {
          a: { seq: ["a", "b"] },
          b: { alt: ["c", "d"] },
          c: "lit",
        },
        composes: [],
      } satisfies Grammar,
      flagSet(["*"]),
    ),
    {
      rules: {
        a: { seq: ["a", "b"] },
        b: { alt: ["c", "d"] },
        c: "lit",
      },
      composes: [],
    } satisfies Grammar,
  );
});

test("keep conditional prods", () => {
  deepEqual(
    pruneCond(
      {
        rules: {
          a: { seq: ["a", { flag: "f1", inv: false, cond: "b" }] },
          b: { alt: ["c", { flag: "f1", inv: false, cond: "d" }] },
          c: { flag: "f1", inv: false, cond: "lit" },
        },
        composes: [],
      } satisfies Grammar,
      flagSet(["*"]),
    ),
    {
      rules: {
        a: { seq: ["a", "b"] },
        b: { alt: ["c", "d"] },
        c: "lit",
      },
      composes: [],
    } satisfies Grammar,
  );
});

test("remove conditional prods", () => {
  deepEqual(
    pruneCond(
      {
        rules: {
          a: { seq: ["a", { flag: "f1", inv: false, cond: "b" }] },
          b: { alt: ["c", { flag: "f1", inv: false, cond: "d" }] },
          c: { flag: "f1", inv: false, cond: "lit" },
        },
        composes: [],
      } satisfies Grammar,
      flagSet(["x"]),
    ),
    {
      rules: {
        a: { seq: ["a"] },
        b: { alt: ["c"] },
        c: "",
      },
      composes: [],
    } satisfies Grammar,
  );
});
