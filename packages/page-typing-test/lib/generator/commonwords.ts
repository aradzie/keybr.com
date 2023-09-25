import { type WordList } from "@keybr/content-words";
import { LCG, randomSample, type RNGStream } from "@keybr/rand";
import { type TextGenerator } from "./types.ts";

type Mark = {
  readonly mark: unknown;
};

export class CommonWordsGenerator implements TextGenerator<Mark> {
  private readonly wordList: WordList;
  private readonly rng: RNGStream;

  constructor(wordList: WordList, rng: RNGStream = LCG(1)) {
    this.wordList = [...wordList];
    this.rng = rng;
  }

  nextWord(): string {
    return randomSample(this.wordList, this.rng);
  }

  mark(): Mark {
    return { mark: this.rng.mark() };
  }

  reset({ mark }: Mark): void {
    this.rng.reset(mark);
  }
}
