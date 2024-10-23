import test from "ava";
import { generate } from "./generate.ts";

test("generate from a deterministic grammar", (t) => {
  t.is(
    generate({
      rules: { start: "only" },
      composes: [],
    }),
    "only",
  );
  t.is(
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
            a: "one",
            b: "two",
          },
          composes: [],
        },
      ],
    }),
    "onetwo",
  );
});

test("alternate between branches", (t) => {
  t.is(
    generate({
      rules: {
        start: {
          seq: [{ ref: "alt" }, { ref: "alt" }, { ref: "alt" }, { ref: "alt" }],
        },
        alt: { alt: ["a", "b"] },
      },
      composes: [],
    }),
    "abab",
  );
});
