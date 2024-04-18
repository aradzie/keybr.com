import test from "ava";
import { generate } from "./generate.ts";

test("generate from a deterministic grammar", (t) => {
  t.is(
    generate({
      start: "only",
    }),
    "only",
  );
  t.is(
    generate({
      start: {
        cls: "xyz",
        span: {
          seq: [{ ref: "a" }, { ref: "b" }],
        },
      },
      a: "one",
      b: "two",
    }),
    "onetwo",
  );
});

test("alternate between branches", (t) => {
  t.is(
    generate({
      start: {
        seq: [{ ref: "alt" }, { ref: "alt" }, { ref: "alt" }, { ref: "alt" }],
      },
      alt: { alt: ["a", "b"] },
    }),
    "abab",
  );
});
