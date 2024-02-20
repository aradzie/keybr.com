import { type LocaleId } from "./locale.ts";

export type Messages = Record<string, string | any>;

export async function loadMessages(locale: LocaleId): Promise<Messages> {
  switch (locale) {
    case "cs":
      return (
        await import(/* webpackChunkName: "i18n-cs" */ "./messages/cs.json")
      ).default;
    case "da":
      return (
        await import(/* webpackChunkName: "i18n-da" */ "./messages/da.json")
      ).default;
    case "de":
      return (
        await import(/* webpackChunkName: "i18n-de" */ "./messages/de.json")
      ).default;
    case "el":
      return (
        await import(/* webpackChunkName: "i18n-el" */ "./messages/el.json")
      ).default;
    case "en":
      return (
        await import(/* webpackChunkName: "i18n-en" */ "./messages/en.json")
      ).default;
    case "es":
      return (
        await import(/* webpackChunkName: "i18n-es" */ "./messages/es.json")
      ).default;
    case "et":
      return (
        await import(/* webpackChunkName: "i18n-et" */ "./messages/et.json")
      ).default;
    case "fr":
      return (
        await import(/* webpackChunkName: "i18n-fr" */ "./messages/fr.json")
      ).default;
    case "he":
      return (
        await import(/* webpackChunkName: "i18n-he" */ "./messages/he.json")
      ).default;
    case "hu":
      return (
        await import(/* webpackChunkName: "i18n-hu" */ "./messages/hu.json")
      ).default;
    case "ja":
      return (
        await import(/* webpackChunkName: "i18n-ja" */ "./messages/ja.json")
      ).default;
    case "nl":
      return (
        await import(/* webpackChunkName: "i18n-nl" */ "./messages/nl.json")
      ).default;
    case "pl":
      return (
        await import(/* webpackChunkName: "i18n-pl" */ "./messages/pl.json")
      ).default;
    case "pt-br":
      return (
        await import(
          /* webpackChunkName: "i18n-pt-br" */ "./messages/pt-br.json"
        )
      ).default;
    case "ru":
      return (
        await import(/* webpackChunkName: "i18n-ru" */ "./messages/ru.json")
      ).default;
    case "sv":
      return (
        await import(/* webpackChunkName: "i18n-sv" */ "./messages/sv.json")
      ).default;
    case "tr":
      return (
        await import(/* webpackChunkName: "i18n-tr" */ "./messages/tr.json")
      ).default;
    case "uk":
      return (
        await import(/* webpackChunkName: "i18n-uk" */ "./messages/uk.json")
      ).default;
    case "zh-Hans":
      return (
        await import(
          /* webpackChunkName: "i18n-zh-Hans" */ "./messages/zh-Hans.json"
        )
      ).default;
  }
}
