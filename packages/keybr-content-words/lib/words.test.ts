import { Language } from "@keybr/keyboard";
import test from "ava";
import { loadWordList } from "./load.ts";

for (const language of Language.ALL) {
  test(`words:${language}`, async (t) => {
    const words = await loadWordList(language);
    const sorted = [...words].sort();
    t.true(sorted.length >= 1500);
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i] === sorted[i + 1]) {
        t.fail(`duplicate word "${sorted[i]}"`);
      }
    }
  });
}
