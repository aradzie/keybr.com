import { LCG } from "@keybr/rand";
import test from "ava";
import { Syntax } from "./syntax.ts";

for (const syntax of Syntax.ALL) {
  test(`syntax ${syntax.name}`, (t) => {
    t.true(syntax.generate(LCG(1)).length > 0);
  });
}
