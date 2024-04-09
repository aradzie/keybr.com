import { Language } from "@keybr/keyboard";
import test from "ava";
import { loadWordList } from "./load.ts";

for (const language of Language.ALL) {
  test(`words:${language}`, async (t) => {
    const words = await loadWordList(language);
    t.true(words.length >= 1500);
    const unique = new Set();
    for (const word of words) {
      if (!language.test(word)) {
        t.fail(`Extraneous word "${word}"`);
      }
      if (unique.has(word)) {
        t.fail(`Duplicate word "${word}"`);
      }
      unique.add(word);
    }
  });
}
