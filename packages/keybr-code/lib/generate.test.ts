import { test } from "node:test";
import { assert } from "chai";
import { generate } from "./generate.ts";

test("generate from a deterministic grammar", () => {
  assert.deepStrictEqual(
    generate({
      rules: { start: "only" },
      composes: [],
    }),
    ["only"],
  );
  assert.deepStrictEqual(
    generate({
      rules: {
        start: {
          cls: "xyz",
          span: {
            seq: [{ ref: "a" }, { ref: "b" }],
          },
        },
      },
      composes: [
        {
          rules: {
            a: { cls: "abc", span: "one" },
            b: { cls: "xyz", span: "two" },
          },
          composes: [],
        },
      ],
    }),
    [
      { cls: "abc", text: "one" },
      { cls: "xyz", text: "two" },
    ],
  );
});

test("alternate between branches", () => {
  assert.deepStrictEqual(
    generate({
      rules: {
        start: {
          seq: [{ ref: "alt" }, { ref: "alt" }, { ref: "alt" }, { ref: "alt" }],
        },
        alt: { alt: ["a", "b"] },
      },
      composes: [],
    }),
    ["a", "b", "a", "b"],
  );
});
