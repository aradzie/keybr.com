import { type Language } from "@keybr/layout";
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

    nextWord(filter: Filter, random?: RNG): string {
      while (true) {
        const word = model.nextWord(filter, random);
        if (blacklist.allow(word)) {
          return word;
        }
      }
    }
  })();
}
