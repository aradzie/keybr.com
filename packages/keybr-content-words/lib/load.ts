import { Language } from "@keybr/layout";
import { type WordList } from "./types.ts";

export async function loadWordList(language: Language): Promise<WordList> {
  switch (language) {
    case Language.BE:
      return (
        await import(
          /* webpackChunkName: "words-be" */
          "./data/words-be.json"
        )
      ).default as unknown as WordList;
    case Language.CS:
      return (
        await import(
          /* webpackChunkName: "words-cs" */
          "./data/words-cs.json"
        )
      ).default as unknown as WordList;
    case Language.DE:
      return (
        await import(
          /* webpackChunkName: "words-de" */
          "./data/words-de.json"
        )
      ).default as unknown as WordList;
    case Language.EL:
      return (
        await import(
          /* webpackChunkName: "words-el" */
          "./data/words-el.json"
        )
      ).default as unknown as WordList;
    case Language.EN:
      return (
        await import(
          /* webpackChunkName: "words-en" */
          "./data/words-en.json"
        )
      ).default as unknown as WordList;
    case Language.ES:
      return (
        await import(
          /* webpackChunkName: "words-es" */
          "./data/words-es.json"
        )
      ).default as unknown as WordList;
    case Language.FR:
      return (
        await import(
          /* webpackChunkName: "words-fr" */
          "./data/words-fr.json"
        )
      ).default as unknown as WordList;
    case Language.HE:
      return (
        await import(
          /* webpackChunkName: "words-he" */
          "./data/words-he.json"
        )
      ).default as unknown as WordList;
    case Language.IT:
      return (
        await import(
          /* webpackChunkName: "words-it" */
          "./data/words-it.json"
        )
      ).default as unknown as WordList;
    case Language.NL:
      return (
        await import(
          /* webpackChunkName: "words-nl" */
          "./data/words-nl.json"
        )
      ).default as unknown as WordList;
    case Language.PL:
      return (
        await import(
          /* webpackChunkName: "words-pl" */
          "./data/words-pl.json"
        )
      ).default as unknown as WordList;
    case Language.PT:
      return (
        await import(
          /* webpackChunkName: "words-pt" */
          "./data/words-pt.json"
        )
      ).default as unknown as WordList;
    case Language.RU:
      return (
        await import(
          /* webpackChunkName: "words-ru" */
          "./data/words-ru.json"
        )
      ).default as unknown as WordList;
    case Language.SL:
      return (
        await import(
          /* webpackChunkName: "words-sl" */
          "./data/words-sl.json"
        )
      ).default as unknown as WordList;
    case Language.SV:
      return (
        await import(
          /* webpackChunkName: "words-sv" */
          "./data/words-sv.json"
        )
      ).default as unknown as WordList;
    case Language.UK:
      return (
        await import(
          /* webpackChunkName: "words-uk" */
          "./data/words-uk.json"
        )
      ).default as unknown as WordList;
    default:
      throw new Error();
  }
}
