import { test } from "node:test";
import { LCG } from "@keybr/rand";
import { flattenStyledText } from "@keybr/textinput";
import { isTrue } from "rich-assert";
import { flagSet } from "./flags.ts";
import { Syntax } from "./syntax.ts";

for (const syntax of Syntax.ALL) {
  test(`syntax ${syntax.name}/no flags`, () => {
    const text = syntax.generate(flagSet([]), LCG(1));
    isTrue(flattenStyledText(text).length > 0);
  });

  test(`syntax ${syntax.name}/all flags`, () => {
    const text = syntax.generate(flagSet(["*"]), LCG(1));
    isTrue(flattenStyledText(text).length > 0);
  });
}
