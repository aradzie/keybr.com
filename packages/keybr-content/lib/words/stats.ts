import { type WordList } from "./types.ts";

export function wordListStats(wordList: WordList): {
  readonly wordCount: number;
  readonly avgWordLength: number;
} {
  let wordLength = 0;
  let wordCount = 0;
  for (const word of wordList) {
    wordLength += word.length;
    wordCount += 1;
  }
  return {
    wordCount,
    avgWordLength: wordCount > 0 ? wordLength / wordCount : 0,
  };
}
