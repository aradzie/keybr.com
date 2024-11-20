import { test } from "node:test";
import { deepEqual } from "rich-assert";
import { generate } from "./generate.ts";

test("generate from a deterministic grammar", () => {
  deepEqual(
    generate({
      rules: { start: "only" },
      composes: [],
    }),
    ["only"],
  );
  deepEqual(
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
  deepEqual(
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
