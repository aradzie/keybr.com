import { LCG } from "@keybr/rand";
import { flattenStyledText } from "@keybr/textinput";
import test from "ava";
import { flagSet } from "./flags.ts";
import { Syntax } from "./syntax.ts";

for (const syntax of Syntax.ALL) {
  test(`syntax ${syntax.name}/no flags`, (t) => {
    const text = syntax.generate(flagSet([]), LCG(1));
    t.true(flattenStyledText(text).length > 0);
  });

  test(`syntax ${syntax.name}/all flags`, (t) => {
    const text = syntax.generate(flagSet(["*"]), LCG(1));
    t.true(flattenStyledText(text).length > 0);
  });
}
