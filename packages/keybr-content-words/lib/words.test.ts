import { test } from "node:test";
import { Language } from "@keybr/keyboard";
import { assert } from "chai";
import { loadWordList } from "./load.ts";

for (const language of Language.ALL) {
  test(`words:${language}`, async () => {
    const words = await loadWordList(language);
    assert.isAbove(words.length, 1500);
    const unique = new Set();
    for (const word of words) {
      if (!language.test(word)) {
        assert.fail(`Extraneous word "${word}"`);
      }
      if (unique.has(word)) {
        assert.fail(`Duplicate word "${word}"`);
      }
      unique.add(word);
    }
  });
}
