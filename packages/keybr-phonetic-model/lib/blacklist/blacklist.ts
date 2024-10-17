import { Language } from "@keybr/keyboard";
import AR from "./blacklist-ar.json" with { type: "json" };
import BE from "./blacklist-be.json" with { type: "json" };
import DE from "./blacklist-de.json" with { type: "json" };
import EN from "./blacklist-en.json" with { type: "json" };
import ES from "./blacklist-es.json" with { type: "json" };
import FA from "./blacklist-fa.json" with { type: "json" };
import FR from "./blacklist-fr.json" with { type: "json" };
import HE from "./blacklist-he.json" with { type: "json" };
import IT from "./blacklist-it.json" with { type: "json" };
import NL from "./blacklist-nl.json" with { type: "json" };
import PL from "./blacklist-pl.json" with { type: "json" };
import PT from "./blacklist-pt.json" with { type: "json" };
import RU from "./blacklist-ru.json" with { type: "json" };
import SV from "./blacklist-sv.json" with { type: "json" };
import TR from "./blacklist-tr.json" with { type: "json" };
import UK from "./blacklist-uk.json" with { type: "json" };
import { unscrambleWord } from "./scramble.ts";

const blacklistByLanguage = ((items: [Language, string[]][]) =>
  new Map<Language, Set<string>>(
    items.map(([language, list]) => [
      language,
      new Set(list.map(unscrambleWord)),
    ]),
  ))([
  [Language.AR, AR],
  [Language.BE, BE],
  [Language.DE, DE],
  [Language.EN, EN],
  [Language.ES, ES],
  [Language.FA, FA],
  [Language.FR, FR],
  [Language.HE, HE],
  [Language.IT, IT],
  [Language.NL, NL],
  [Language.PL, PL],
  [Language.PT, PT],
  [Language.RU, RU],
  [Language.SV, SV],
  [Language.TR, TR],
  [Language.UK, UK],
]);

export type Blacklist = { readonly allow: (word: string) => boolean };

export function getBlacklist(language: Language): Blacklist {
  const blacklist = blacklistByLanguage.get(language) ?? null;
  if (blacklist != null && blacklist.size > 0) {
    return new (class implements Blacklist {
      allow(word: string): boolean {
        return !blacklist.has(language.lowerCase(word));
      }
    })();
  } else {
    return new (class implements Blacklist {
      allow(word: string): boolean {
        return true;
      }
    })();
  }
}
