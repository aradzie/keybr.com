#!/usr/bin/env -S node --import @keybr/tsl

import { LCG } from "@keybr/rand";
import { flagSet } from "./flags.ts";
import { Syntax } from "./syntax.ts";

for (const syntax of Syntax.ALL) {
  console.log(`=== ${syntax.name} (${[...syntax.flags].join(",")}) ===`);
  const rng = LCG(1);
  for (let i = 0; i < 5; i++) {
    console.log(syntax.generate(flagSet(["*"]), rng));
  }
  console.log();
}
