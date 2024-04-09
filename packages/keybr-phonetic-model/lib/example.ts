#!/usr/bin/env -S node -r @keybr/tsl

import { Language } from "@keybr/keyboard";
import { Filter } from "./filter.ts";
import { loadModelSync } from "./fs-load.ts";

for (const language of Language.ALL) {
  example(language).catch((error) => console.error(error));
}

async function example(language: Language): Promise<void> {
  const { model } = loadModelSync(language);
  const { letters } = model;
  console.log(`${language} [${letters.map(String).join(",")}]`);
  const words = [];
  for (let i = 0; i < 100; i++) {
    words.push(model.nextWord(Filter.empty));
  }
  console.log(words.join(" ") + "\n");
}
