import { type Language, type Ngram1, type Ngram2 } from "@keybr/keyboard";
import { type RNG } from "@keybr/rand";
import { getBlacklist } from "./blacklist/blacklist.ts";
import { type Filter } from "./filter.ts";
import { PhoneticModel } from "./phoneticmodel.ts";

export function censor(
  model: PhoneticModel,
  language: Language,
): PhoneticModel {
  const blacklist = getBlacklist(language);

  return new (class extends PhoneticModel {
    constructor() {
      super(model.letters);
    }

    override nextWord(filter: Filter, random?: RNG): string {
      while (true) {
        const word = model.nextWord(filter, random);
        if (blacklist.allow(word)) {
          return word;
        }
      }
    }

    override ngram1(): Ngram1 {
      return model.ngram1();
    }

    override ngram2(): Ngram2 {
      return model.ngram2();
    }
  })();
}
