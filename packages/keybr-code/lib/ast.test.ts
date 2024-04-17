import test from "ava";
import { hasCodePoints, type RuleMap, withCodePoints } from "./ast.ts";

test("calculate codepoints from grammar", (t) => {
  const grammar: RuleMap = {
    start: {
      alt: [{ ref: "a" }, { ref: "b" }],
    },

    a: { seq: ["1", "2", "3"] },
    b: { seq: ["4", { f: 1, opt: "c" }, "5"] },
  };

  const grammarWithCodepoints = withCodePoints("start", grammar);
  t.true(hasCodePoints(grammarWithCodepoints.start));
  if (hasCodePoints(grammarWithCodepoints.start)) {
    t.deepEqual(grammarWithCodepoints.start.codePoints, [
      new Set([51, 50, 49]),
      new Set([53, 99, 52]),
    ]);
  }
});
