import { type WordList } from "@keybr/content-words";
import { LCG, randomSample, type RNGStream } from "@keybr/rand";
import { type TextGenerator } from "./types.ts";

type CommonWordsSettings = {
  readonly wordListSize: number;
};

type Mark = {
  readonly mark: unknown;
};

export class CommonWordsGenerator implements TextGenerator<Mark> {
  readonly #wordList: WordList;
  readonly #rng: RNGStream;

  constructor(
    { wordListSize }: CommonWordsSettings,
    wordList: WordList,
    rng: RNGStream = LCG(1),
  ) {
    this.#wordList = [...wordList].splice(0, wordListSize);
    this.#rng = rng;
  }

  nextWord(): string {
    return randomSample(this.#wordList, this.#rng);
  }

  mark(): Mark {
    return { mark: this.#rng.mark() };
  }

  reset({ mark }: Mark): void {
    this.#rng.reset(mark);
  }
}
