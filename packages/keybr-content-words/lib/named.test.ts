import { test } from "node:test";
import { NamedWordList } from "@keybr/content";
import { fail, isTrue } from "rich-assert";
import { loadNamedWordList } from "./load.ts";

for (const wordList of NamedWordList.ALL) {
  test(`named word list:${wordList.id}`, async () => {
    const words = await loadNamedWordList(wordList);
    isTrue(words.length > 0);
    const unique = new Set();
    for (const word of words) {
      if (!wordList.language.test(word)) {
        fail(`Extraneous word "${word}"`);
      }
      if (unique.has(word)) {
        fail(`Duplicate word "${word}"`);
      }
      unique.add(word);
    }
  });
}
