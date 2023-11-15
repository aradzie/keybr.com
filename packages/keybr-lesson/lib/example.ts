#!/usr/bin/env -S node -r @keybr/tsl

import { loadWordList } from "@keybr/content-words/lib/load.ts";
import { Language } from "@keybr/layout";
import { Filter, Letter } from "@keybr/phonetic-model";
import { loadModelSync } from "@keybr/phonetic-model/lib/fs-load.ts";
import { Dictionary } from "./dictionary.ts";

for (const language of Language.ALL) {
  example(language).catch((error) => console.error(error));
}

async function example(language: Language): Promise<void> {
  const wordList = await loadWordList(language);
  const dict = new Dictionary(wordList.filter((word) => word.length > 2));
  const { model } = loadModelSync(language);
  const letters = Letter.frequencyOrder(model.letters);
  console.log(`====== ${language} ======`);
  for (let i = 6; i < letters.length; i++) {
    const subset = letters.slice(0, i);
    const counts = [dict.find(new Filter(subset)).length];
    for (let j = 0; j < i; j++) {
      counts.push(dict.find(new Filter(subset, subset[j])).length);
    }
    console.log(asString(subset), ...counts);
  }
}

function asString(letters: readonly Letter[]): string {
  return String.fromCodePoint(...letters.map(({ codePoint }) => codePoint));
}
