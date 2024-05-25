import { type WordList } from "@keybr/content";
import { Language } from "@keybr/keyboard";

export async function loadWordList(language: Language): Promise<WordList> {
  switch (language) {
    case Language.AR:
      return (
        await import(/* webpackChunkName: "words-ar" */ "./data/words-ar.json")
      ).default as WordList;
    case Language.BE:
      return (
        await import(/* webpackChunkName: "words-be" */ "./data/words-be.json")
      ).default as WordList;
    case Language.CS:
      return (
        await import(/* webpackChunkName: "words-cs" */ "./data/words-cs.json")
      ).default as WordList;
    case Language.DE:
      return (
        await import(/* webpackChunkName: "words-de" */ "./data/words-de.json")
      ).default as WordList;
    case Language.EL:
      return (
        await import(/* webpackChunkName: "words-el" */ "./data/words-el.json")
      ).default as WordList;
    case Language.EN:
      return (
        await import(/* webpackChunkName: "words-en" */ "./data/words-en.json")
      ).default as WordList;
    case Language.ES:
      return (
        await import(/* webpackChunkName: "words-es" */ "./data/words-es.json")
      ).default as WordList;
    case Language.FA:
      return (
        await import(/* webpackChunkName: "words-fa" */ "./data/words-fa.json")
      ).default as WordList;
    case Language.FR:
      return (
        await import(/* webpackChunkName: "words-fr" */ "./data/words-fr.json")
      ).default as WordList;
    case Language.HE:
      return (
        await import(/* webpackChunkName: "words-he" */ "./data/words-he.json")
      ).default as WordList;
    case Language.HU:
      return (
        await import(/* webpackChunkName: "words-hu" */ "./data/words-hu.json")
      ).default as WordList;
    case Language.IT:
      return (
        await import(/* webpackChunkName: "words-it" */ "./data/words-it.json")
      ).default as WordList;
    case Language.NB:
      return (
        await import(/* webpackChunkName: "words-nb" */ "./data/words-nb.json")
      ).default as WordList;
    case Language.NL:
      return (
        await import(/* webpackChunkName: "words-nl" */ "./data/words-nl.json")
      ).default as WordList;
    case Language.PL:
      return (
        await import(/* webpackChunkName: "words-pl" */ "./data/words-pl.json")
      ).default as WordList;
    case Language.PT:
      return (
        await import(/* webpackChunkName: "words-pt" */ "./data/words-pt.json")
      ).default as WordList;
    case Language.RU:
      return (
        await import(/* webpackChunkName: "words-ru" */ "./data/words-ru.json")
      ).default as WordList;
    case Language.SL:
      return (
        await import(/* webpackChunkName: "words-sl" */ "./data/words-sl.json")
      ).default as WordList;
    case Language.SV:
      return (
        await import(/* webpackChunkName: "words-sv" */ "./data/words-sv.json")
      ).default as WordList;
    case Language.TR:
      return (
        await import(/* webpackChunkName: "words-tr" */ "./data/words-tr.json")
      ).default as WordList;
    case Language.UK:
      return (
        await import(/* webpackChunkName: "words-uk" */ "./data/words-uk.json")
      ).default as WordList;
    default:
      throw new Error();
  }
}
