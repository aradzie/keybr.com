import { LCG } from "@keybr/rand";
import test from "ava";
import { flagSet } from "./flags.ts";
import { Syntax } from "./syntax.ts";

for (const syntax of Syntax.ALL) {
  test(`syntax ${syntax.name}`, (t) => {
    t.true(syntax.generate(flagSet([]), LCG(1)).length > 0);
    t.true(syntax.generate(flagSet(["*"]), LCG(1)).length > 0);
  });
}
