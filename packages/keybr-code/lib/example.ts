#!/usr/bin/env -S node -r @keybr/tsl

import { LCG } from "@keybr/rand";
import { Syntax } from "./syntax.ts";

for (const syntax of Syntax.ALL) {
  console.log(`=== ${syntax.name} ===`);
  const rng = LCG(1);
  for (let i = 0; i < 5; i++) {
    console.log(syntax.generate(rng));
  }
  console.log();
}
