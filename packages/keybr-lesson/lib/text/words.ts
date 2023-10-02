import {
  type Filter,
  type Letter,
  type PhoneticModel,
} from "@keybr/phonetic-model";
import { randomSample, type RNG, weightedRandomSample } from "@keybr/rand";

export type WordGenerator = () => string;

export function phoneticWords(
  model: PhoneticModel,
  filter: Filter,
  random: RNG,
): WordGenerator {
  return (): string => {
    return model.nextWord(filter, random) || "?";
  };
}

export function randomWords(
  wordList: readonly string[],
  random: RNG,
): WordGenerator {
  return (): string => {
    return randomSample(wordList, random);
  };
}

export function wordSequence(
  wordList: readonly string[],
  cursor: { wordIndex: number },
): WordGenerator {
  return (): string => {
    const { length } = wordList;
    if (length > 0) {
      let { wordIndex } = cursor;
      if (wordIndex >= length) {
        wordIndex = 0;
      }
      const word = wordList[wordIndex];
      cursor.wordIndex = wordIndex + 1;
      return word;
    } else {
      return "?";
    }
  };
}

export function uniqueWords(nextWord: WordGenerator): WordGenerator {
  let last = "";
  return (): string => {
    let n = 0;
    let word = "";
    while (n < 3) {
      word = nextWord();
      if (word !== last) {
        last = word;
        return word;
      }
      n++;
    }
    return word;
  };
}

export function mangledWords(
  nextWord: WordGenerator,
  punctuators: readonly Letter[],
  {
    withCapitals = 0,
    withPunctuators = 0,
  }: {
    withCapitals?: number;
    withPunctuators?: number;
  },
  random: RNG,
): WordGenerator {
  return (): string => {
    let word = nextWord();
    if (withCapitals > 0 && withCapitals >= random()) {
      word = word.substring(0, 1).toUpperCase() + word.substring(1);
    }
    if (withPunctuators > 0 && withPunctuators >= random()) {
      const { codePoint } = weightedRandomSample(
        punctuators,
        ({ f }) => f,
        random,
      );
      switch (codePoint) {
        case 33:
          word = `${word}!`;
          break;
        case 34:
          word = `"${word}"`;
          break;
        case 39:
          word = `'${word}'`;
          break;
        case 44:
          word = `${word},`;
          break;
        case 45:
          word = `${word}-${nextWord()}`;
          break;
        case 46:
          word = `${word}.`;
          break;
        case 58:
          word = `${word}:`;
          break;
        case 59:
          word = `${word};`;
          break;
        case 63:
          word = `${word}?`;
          break;
      }
    }
    return word;
  };
}
