import test from "ava";
import { generate } from "./generate.ts";

test("generate from deterministic grammar", (t) => {
  t.is(
    generate({
      rule: {
        start: "only",
      },
    }),
    "only",
  );
  t.is(
    generate({
      rule: {
        start: {
          cls: "xyz",
          span: {
            seq: [{ ref: "a" }, { ref: "b" }],
          },
        },
        a: "one",
        b: "two",
      },
    }),
    "onetwo",
  );
});
