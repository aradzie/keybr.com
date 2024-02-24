import { Language } from "@keybr/layout";
import blacklistBe from "./blacklist-be.json";
import blacklistDe from "./blacklist-de.json";
import blacklistEn from "./blacklist-en.json";
import blacklistEs from "./blacklist-es.json";
import blacklistFr from "./blacklist-fr.json";
import blacklistIt from "./blacklist-it.json";
import blacklistNl from "./blacklist-nl.json";
import blacklistPl from "./blacklist-pl.json";
import blacklistPt from "./blacklist-pt.json";
import blacklistRu from "./blacklist-ru.json";
import blacklistSv from "./blacklist-sv.json";
import blacklistUk from "./blacklist-uk.json";
import { unscrambleWord } from "./scramble.ts";

const blacklistByLanguage = ((items: [Language, string[]][]) =>
  new Map<Language, Set<string>>(
    items.map(([language, list]) => [
      language,
      new Set(list.map(unscrambleWord)),
    ]),
  ))([
  [Language.BE, blacklistBe],
  [Language.DE, blacklistDe],
  [Language.EN, blacklistEn],
  [Language.ES, blacklistEs],
  [Language.FR, blacklistFr],
  [Language.IT, blacklistIt],
  [Language.NL, blacklistNl],
  [Language.PL, blacklistPl],
  [Language.PT, blacklistPt],
  [Language.RU, blacklistRu],
  [Language.SV, blacklistSv],
  [Language.UK, blacklistUk],
]);

export type Blacklist = { readonly allow: (word: string) => boolean };

export function getBlacklist(language: Language): Blacklist {
  const blacklist = blacklistByLanguage.get(language) ?? null;
  if (blacklist != null && blacklist.size > 0) {
    return new (class implements Blacklist {
      allow(word: string): boolean {
        return !blacklist.has(word.toLowerCase());
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
