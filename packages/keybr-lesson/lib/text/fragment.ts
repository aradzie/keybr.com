import { type Settings } from "@keybr/settings";
import { type WordGenerator } from "./words.ts";

export function generateFragment(
  settings: Settings,
  nextWord: WordGenerator,
): string {
  const textLength = 100 + Math.round(settings.lessonLength * 100);
  const words: string[] = [];
  let wordsLength = 0;
  while (true) {
    const word = nextWord() || "?";
    words.push(word);
    wordsLength += word.length;
    if (wordsLength >= textLength) {
      break;
    }
  }
  return words.join(" ");
}
