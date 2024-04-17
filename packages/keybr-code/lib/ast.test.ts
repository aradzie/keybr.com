import test from "ava";
import { hasCodePoints, type Rules, withCodePoints } from "./ast.ts";

test("calculate codepoints from grammar", (t) => {
  const rules = {
    start: {
      alt: [{ ref: "a" }, { ref: "b" }],
    },
    a: { seq: ["1", "2", "3"] },
    b: { seq: ["4", { f: 1, opt: "c" }, "5"] },
  } satisfies Rules;
  const rulesWithCodepoints = withCodePoints("start", rules);
  t.true(hasCodePoints(rulesWithCodepoints.start));
  if (hasCodePoints(rulesWithCodepoints.start)) {
    t.deepEqual(rulesWithCodepoints.start.codePoints, [
      new Set([51, 50, 49]),
      new Set([53, 99, 52]),
    ]);
  }
});
