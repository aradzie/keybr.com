#!/usr/bin/env -S npx tsnode

import { LCG } from "@keybr/rand";
import { flattenStyledText } from "@keybr/textinput";
import { flagSet } from "./flags.ts";
import { Syntax } from "./syntax.ts";

for (const syntax of Syntax.ALL) {
  console.log(`=== ${syntax.name} (${[...syntax.flags].join(",")}) ===`);
  const rng = LCG(1);
  for (let i = 0; i < 5; i++) {
    const text = syntax.generate(flagSet(["*"]), rng);
    console.log(flattenStyledText(text));
  }
  console.log();
}
