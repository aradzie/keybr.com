import { test } from "node:test";
import { deepEqual } from "rich-assert";
import { findFlags } from "./find-flags.ts";
import { parse } from "./parse.ts";

test("find flags", () => {
  const rules = parse(
    `a -> { :if(f1) "a" { :if(f2) "b" | { :if(f3) "c" } } };\n` +
      `b -> "..." { :class(c1) { :if(xyz) "1" | "2" | "3" } } "...";\n`,
  );
  const flags = findFlags(rules);
  deepEqual(flags, new Set(["f1", "f2", "f3", "xyz"]));
});
