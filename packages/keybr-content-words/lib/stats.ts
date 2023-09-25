import { type WordList } from "./types.ts";

export function wordListStats(wordList: WordList): {
  wordCount: number;
  avgWordLength: number;
} {
  let wordLength = 0;
  let wordCount = 0;
  for (const word of wordList) {
    wordLength += word.length;
    wordCount += 1;
  }
  return {
    wordCount,
    avgWordLength: wordLength / wordCount,
  };
}
