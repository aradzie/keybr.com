import { type Settings } from "@keybr/settings";
import { lessonProps } from "../settings.ts";
import { type WordGenerator } from "./words.ts";

export function generateFragment(
  settings: Settings,
  nextWord: WordGenerator,
  { doubleWords }: { readonly doubleWords: boolean },
): string {
  const length = 100 + Math.round(settings.get(lessonProps.length) * 100);
  const words: string[] = [];
  let wordsLength = 0;
  while (true) {
    const word = nextWord() || "?";
    words.push(word);
    wordsLength += word.length;
    if (doubleWords) {
      words.push(word);
      wordsLength += word.length;
    }
    if (wordsLength >= length) {
      break;
    }
  }
  return words.join(" ");
}
