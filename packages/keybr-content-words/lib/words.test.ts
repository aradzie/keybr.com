import { test } from "node:test";
import { Language } from "@keybr/keyboard";
import { fail, isTrue } from "rich-assert";
import { loadWordList } from "./load.ts";

for (const language of Language.ALL) {
  test(`words:${language}`, async () => {
    const words = await loadWordList(language);
    isTrue(words.length > 1500);
    const unique = new Set();
    for (const word of words) {
      if (!language.test(word)) {
        fail(`Extraneous word "${word}"`);
      }
      if (unique.has(word)) {
        fail(`Duplicate word "${word}"`);
      }
      unique.add(word);
    }
  });
}
