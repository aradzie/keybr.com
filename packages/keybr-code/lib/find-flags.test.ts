import test from "ava";
import { findFlags } from "./find-flags.ts";
import { parse } from "./parse.ts";

test("find flags", (t) => {
  const rules = parse(
    `a -> { :if(f1) "a" { :if(f2) "b" | { :if(f3) "c" } } };\n` +
      `b -> "..." { :class(c1) { :if(xyz) "1" | "2" | "3" } } "...";\n`,
  );
  const flags = findFlags(rules);
  t.deepEqual(flags, new Set(["f1", "f2", "f3", "xyz"]));
});
