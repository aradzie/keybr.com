import { Language } from "@keybr/keyboard";
import test from "ava";
import { Filter } from "./filter.ts";
import { loadModelSync } from "./fs-load.ts";
import { Letter } from "./letter.ts";

const alphabet = /^\u{0020}\p{Letter}+$/u;
const word = /^\p{Letter}+$/u;

for (const language of Language.ALL) {
  test(`${language.id}`, (t) => {
    const { table, model } = loadModelSync(language);
    const letters = Letter.frequencyOrder(model.letters);
    const { chain } = table;

    // Check model settings.
    t.regex(String.fromCodePoint(...table.alphabet), alphabet);
    t.is(table.size, table.alphabet.length);
    t.is(table.order, 4);

    // Check letters.
    t.true(letters.every(({ f }) => f > 0));

    // Check transition table.
    for (const suffixes of table.segments) {
      if (suffixes.length > 0) {
        let sum = 0;
        let last = null;
        for (const suffix of suffixes) {
          if (last != null) {
            t.true(
              chain.index(last.codePoint) < chain.index(suffix.codePoint),
              "Must be sorted by index in increasing order",
            );
          }
          t.true(suffix.frequency > 0, "Must have positive frequencies");
          sum += suffix.frequency;
          last = suffix;
        }
        t.is(sum, 255, "Frequencies must add up exactly to 255");
      }
    }

    // Generate words without filter.
    t.regex(model.nextWord(new Filter(null, null)), word);
    for (const letter of letters) {
      t.regex(model.nextWord(new Filter(null, letter)), word);
    }

    // Generate words with filter.
    for (let i = 6; i <= letters.length; i++) {
      const subset = letters.slice(0, i);
      t.regex(model.nextWord(new Filter(subset, null)), word);
      for (const letter of subset) {
        t.regex(model.nextWord(new Filter(subset, letter)), word);
      }
    }
  });
}
