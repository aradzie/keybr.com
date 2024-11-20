import { test } from "node:test";
import { Language } from "@keybr/keyboard";
import { equal, isTrue, match } from "rich-assert";
import { Filter } from "./filter.ts";
import { loadModelSync } from "./fs-load.ts";
import { Letter } from "./letter.ts";

for (const language of Language.ALL) {
  test(`${language.id}`, () => {
    const { table, model } = loadModelSync(language);
    const letters = Letter.frequencyOrder(model.letters);
    const { chain } = table;

    let alphabet: RegExp;
    let word: RegExp;
    if (language.script === "thai") {
      // Some Thai vowels are recognized as Mark not Letter.
      alphabet = /^\u{0020}[\p{Letter}\p{Mark}]+$/u;
      word = /^[\p{Letter}\p{Mark}]+$/u;
    } else {
      alphabet = /^\u{0020}\p{Letter}+$/u;
      word = /^\p{Letter}+$/u;
    }

    // Check model settings.
    match(String.fromCodePoint(...table.alphabet), alphabet);
    equal(table.size, table.alphabet.length);
    equal(table.order, 4);

    // Check letters.
    isTrue(letters.every(({ f }) => f > 0));

    // Check transition table.
    for (const suffixes of table.segments) {
      if (suffixes.length > 0) {
        let sum = 0;
        let last = null;
        for (const suffix of suffixes) {
          if (last != null) {
            isTrue(
              chain.index(last.codePoint) < chain.index(suffix.codePoint),
              "Must be sorted by index in increasing order",
            );
          }
          isTrue(suffix.frequency > 0, "Must have positive frequencies");
          sum += suffix.frequency;
          last = suffix;
        }
        equal(sum, 255, "Frequencies must add up exactly to 255");
      }
    }

    // Generate words without a filter.
    match(model.nextWord(new Filter(null, null)), word);
    for (const letter of letters) {
      match(model.nextWord(new Filter(null, letter)), word);
    }

    // Generate words with a filter.
    for (let i = 6; i <= letters.length; i++) {
      const subset = letters.slice(0, i);
      match(model.nextWord(new Filter(subset, null)), word);
      for (const letter of subset) {
        match(model.nextWord(new Filter(subset, letter)), word);
      }
    }
  });
}
