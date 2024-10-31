import { Filter, type PhoneticModel } from "@keybr/phonetic-model";
import { LCG, type RNGStream } from "@keybr/rand";
import { type TextGenerator } from "./types.ts";

type Mark = {
  readonly mark: unknown;
};

export class PseudoWordsGenerator implements TextGenerator<Mark> {
  readonly #model: PhoneticModel;
  readonly #rng: RNGStream;

  constructor(model: PhoneticModel, rng: RNGStream = LCG(1)) {
    this.#model = model;
    this.#rng = rng;
  }

  nextWord(): string {
    return this.#model.nextWord(Filter.empty, this.#rng);
  }

  mark(): Mark {
    return { mark: this.#rng.mark() };
  }

  reset({ mark }: Mark): void {
    this.#rng.reset(mark);
  }
}
