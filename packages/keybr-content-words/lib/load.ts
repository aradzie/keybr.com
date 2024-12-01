import { type WordList } from "@keybr/content";
import { Language } from "@keybr/keyboard";

export async function loadWordList(language: Language): Promise<WordList> {
  switch (language) {
    case Language.AR:
      return (
        await import(
          /* webpackChunkName: "words-ar" */ "./data/words-ar.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.BE:
      return (
        await import(
          /* webpackChunkName: "words-be" */ "./data/words-be.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.CS:
      return (
        await import(
          /* webpackChunkName: "words-cs" */ "./data/words-cs.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.DE:
      return (
        await import(
          /* webpackChunkName: "words-de" */ "./data/words-de.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.EL:
      return (
        await import(
          /* webpackChunkName: "words-el" */ "./data/words-el.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.EN:
      return (
        await import(
          /* webpackChunkName: "words-en" */ "./data/words-en.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.ES:
      return (
        await import(
          /* webpackChunkName: "words-es" */ "./data/words-es.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.FA:
      return (
        await import(
          /* webpackChunkName: "words-fa" */ "./data/words-fa.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.FR:
      return (
        await import(
          /* webpackChunkName: "words-fr" */ "./data/words-fr.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.HE:
      return (
        await import(
          /* webpackChunkName: "words-he" */ "./data/words-he.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.HR:
      return (
        await import(
          /* webpackChunkName: "words-hr" */ "./data/words-hr.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.HU:
      return (
        await import(
          /* webpackChunkName: "words-hu" */ "./data/words-hu.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.IT:
      return (
        await import(
          /* webpackChunkName: "words-it" */ "./data/words-it.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.LT:
      return (
        await import(
          /* webpackChunkName: "words-lt" */ "./data/words-lt.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.NB:
      return (
        await import(
          /* webpackChunkName: "words-nb" */ "./data/words-nb.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.NL:
      return (
        await import(
          /* webpackChunkName: "words-nl" */ "./data/words-nl.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.PL:
      return (
        await import(
          /* webpackChunkName: "words-pl" */ "./data/words-pl.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.PT:
      return (
        await import(
          /* webpackChunkName: "words-pt" */ "./data/words-pt.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.RO:
      return (
        await import(
          /* webpackChunkName: "words-ro" */ "./data/words-ro.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.RU:
      return (
        await import(
          /* webpackChunkName: "words-ru" */ "./data/words-ru.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.SL:
      return (
        await import(
          /* webpackChunkName: "words-sl" */ "./data/words-sl.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.SV:
      return (
        await import(
          /* webpackChunkName: "words-sv" */ "./data/words-sv.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.TH:
      return (
        await import(
          /* webpackChunkName: "words-th" */ "./data/words-th.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.TR:
      return (
        await import(
          /* webpackChunkName: "words-tr" */ "./data/words-tr.json",
          { with: { type: "json" } }
        )
      ).default;
    case Language.UK:
      return (
        await import(
          /* webpackChunkName: "words-uk" */ "./data/words-uk.json",
          { with: { type: "json" } }
        )
      ).default;
    default:
      throw new Error();
  }
}
