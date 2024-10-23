import { type Settings } from "@keybr/settings";
import { lessonProps } from "../settings.ts";
import { type WordGenerator } from "./words.ts";

export function generateFragment(
  settings: Settings,
  nextWord: WordGenerator,
  { repeatWords = 1 }: { readonly repeatWords?: number } = {},
): string {
  const length = 100 + Math.round(settings.get(lessonProps.length) * 100);
  const words: string[] = [];
  let wordsLength = 0;
  while (true) {
    const word = nextWord() || "?";
    for (let i = 1; i <= repeatWords; i++) {
      words.push(word);
      wordsLength += word.length;
      if (wordsLength >= length) {
        return words.join(" ");
      }
    }
  }
}
