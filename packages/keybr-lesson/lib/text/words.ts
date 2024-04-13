import { type Language } from "@keybr/keyboard";
import {
  type Filter,
  type Letter,
  type PhoneticModel,
} from "@keybr/phonetic-model";
import { randomSample, type RNG, weightedRandomSample } from "@keybr/rand";

export type WordGenerator = () => string | "" | null;

export function phoneticWords(
  model: PhoneticModel,
  filter: Filter,
  random: RNG,
): WordGenerator {
  return () => {
    return model.nextWord(filter, random) || null;
  };
}

export function randomWords(
  wordList: readonly string[],
  random: RNG,
): WordGenerator {
  return () => {
    if (wordList.length > 0) {
      return randomSample(wordList, random);
    } else {
      return null;
    }
  };
}

export function wordSequence(
  wordList: readonly string[],
  cursor: { wordIndex: number },
): WordGenerator {
  return () => {
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
      return null;
    }
  };
}

export function uniqueWords(nextWord: WordGenerator): WordGenerator {
  let last = "";
  return () => {
    let n = 0;
    let word = null;
    while (n < 3) {
      word = nextWord();
      if (word == null || word === "") {
        return null;
      }
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
  language: Language,
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
  return () => {
    let word = nextWord();
    if (word == null || word === "") {
      return null;
    }
    if (withCapitals > 0 && withCapitals >= random()) {
      word = language.capitalCase(word);
    }
    if (
      punctuators.length !== 0 &&
      withPunctuators > 0 &&
      withPunctuators >= random()
    ) {
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
        // Programming specific symbols.
        case 40:
        case 41:
          word = `(${word})`;
          break;
        case 123:
        case 125:
          word = `{${word}}`;
          break;
        case 61:
          word = `${word}=${nextWord()}`;
          break;
        case 43:
          word = `${word}+${nextWord()}`;
          break;
        case 42:
          word = `*${word}`;
          break;
        case 47:
          word = `${word}/${nextWord()}`;
          break;
        case 37:
          word = `${word}%`;
          break;
        case 124:
          word = `${word}|${nextWord()}`;
          break;
        case 38:
          word = `${word}&${nextWord()}`;
          break;
        case 60:
        case 62:
          word = `<${word}>`;
          break;
        case 91:
        case 93:
          word = `[${word}]`;
          break;
        case 95:
          word = `${word}_${nextWord()}`;
          break;
        default:
          word = `${word}${String.fromCodePoint(codePoint)}`;
          break;
      }
    }
    return word;
  };
}
