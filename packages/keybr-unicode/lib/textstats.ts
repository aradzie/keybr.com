import { newTextScanner } from "./textscanner.ts";

export type TextStats = {
  readonly numCharacters: number;
  readonly numWhitespace: number;
  readonly numWords: number;
  readonly numUniqueWords: number;
  readonly avgWordLength: number;
  readonly wordCount: readonly WordCount[];
};

export type WordCount = {
  readonly word: string;
  readonly count: number;
};

export type TextStatsBuilder = {
  append(text: string | readonly string[]): void;
  build(): TextStats;
};

export const textStatsOf = (text: string | readonly string[]): TextStats => {
  const collator = new Intl.Collator();
  const words = new Map<string, number>();
  let numCharacters = 0;
  let numWhitespace = 0;
  let numWords = 0;
  let lenWords = 0;

  const addWord = (word: string, length: number): void => {
    word = word.toLowerCase();
    words.set(word, (words.get(word) ?? 0) + 1);
    numWords += 1;
    lenWords += length;
  };

  const append = (text: string): void => {
    const scanner = newTextScanner(text);
    while (!scanner.end) {
      if (scanner.scanWord()) {
        addWord(scanner.scannedText, scanner.scannedLength);
        numCharacters += scanner.scannedLength;
        continue;
      }
      if (scanner.scanWhitespace()) {
        numWhitespace += scanner.scannedLength;
        continue;
      }
      scanner.next();
      numCharacters += 1;
    }
  };

  if (Array.isArray(text)) {
    for (const item of text) {
      append(item as string);
    }
  } else {
    append(text as string);
  }

  const numUniqueWords = words.size;
  const avgWordLength = numWords > 0 ? lenWords / numWords : 0;
  const wordCount = Array.from(words.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || collator.compare(a.word, b.word));

  return {
    numCharacters,
    numWhitespace,
    numWords,
    numUniqueWords,
    avgWordLength,
    wordCount,
  };
};
