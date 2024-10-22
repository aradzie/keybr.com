import test from "ava";
import { generate } from "./generate.ts";

test("generate from a deterministic grammar", (t) => {
  t.deepEqual(
    generate({
      rules: { start: "only" },
      composes: [],
    }),
    ["only"],
  );
  t.deepEqual(
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

test("alternate between branches", (t) => {
  t.deepEqual(
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
