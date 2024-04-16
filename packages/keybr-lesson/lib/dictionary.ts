import { type WordList } from "@keybr/content-words";
import { type Filter } from "@keybr/phonetic-model";
import {
  type CodePoint,
  type CodePointSet,
  toCodePoints,
} from "@keybr/unicode";

export class Dictionary implements Iterable<string> {
  readonly #words: Word[] = [];
  readonly #dict = new Map<CodePoint, Word[]>();

  constructor(wordList: WordList) {
    for (const item of wordList) {
      const word = new Word(item);
      this.#words.push(word);
      for (const codePoint of word.codePoints) {
        let list = this.#dict.get(codePoint);
        if (list == null) {
          this.#dict.set(codePoint, (list = []));
        }
        if (!list.includes(word)) {
          list.push(word);
        }
      }
    }
  }

  *[Symbol.iterator](): IterableIterator<string> {
    for (const word of this.#words) {
      yield word.value;
    }
  }

  find({ codePoints, focusedCodePoint }: Filter): WordList {
    let words = this.#words;
    if (focusedCodePoint != null) {
      words = this.#dict.get(focusedCodePoint) ?? [];
    }
    if (codePoints != null) {
      words = words.filter((word) => word.matches(codePoints));
    }
    return words.map(({ value }) => value);
  }
}

class Word {
  readonly value: string;
  readonly codePoints: readonly CodePoint[];

  constructor(value: string) {
    this.value = value;
    this.codePoints = [...toCodePoints(value)];
  }

  matches(codePoints: CodePointSet): boolean {
    return this.codePoints.every((codePoint) => codePoints.has(codePoint));
  }

  toString() {
    return this.value;
  }
}

export const filterWordList = (
  words: WordList,
  codePoints: CodePointSet,
): string[] =>
  words.filter((word) =>
    [...toCodePoints(word)].every((codePoint) => codePoints.has(codePoint)),
  );
