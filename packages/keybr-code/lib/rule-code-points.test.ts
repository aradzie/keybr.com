import { toCodePoints } from "@keybr/unicode";
import test from "ava";
import { type HasCodePoints, type Rules } from "./ast.ts";
import { collectCodePoints } from "./rule-code-points.ts";

test("collect codepoints", (t) => {
  const rules = {
    start: {
      alt: [{ ref: "a" }, { ref: "b" }],
    },
    a: { seq: ["1", "2", "3"] },
    b: { seq: ["4", { f: 1, opt: "5" }, "6"] },
  } satisfies Rules;

  collectCodePoints(rules);

  t.deepEqual(
    (rules.a as HasCodePoints).codePoints,
    new Set(toCodePoints("123")),
  );
  t.deepEqual(
    (rules.b as HasCodePoints).codePoints,
    new Set(toCodePoints("456")),
  );
  t.deepEqual(
    (rules.start as HasCodePoints).codePoints,
    new Set(toCodePoints("123456")),
  );
});
