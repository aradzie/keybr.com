import { type LocaleId } from "./locale.ts";

export type Messages = Record<string, string | any>;

export async function loadMessages(locale: LocaleId): Promise<Messages> {
  // prettier-ignore
  switch (locale) {
    case "cs": return (await import(/* webpackChunkName: "messages-cs" */ "./messages/cs.json")).default;
    case "da": return (await import(/* webpackChunkName: "messages-da" */ "./messages/da.json")).default;
    case "de": return (await import(/* webpackChunkName: "messages-de" */ "./messages/de.json")).default;
    case "el": return (await import(/* webpackChunkName: "messages-el" */ "./messages/el.json")).default;
    case "en": return (await import(/* webpackChunkName: "messages-en" */ "./messages/en.json")).default;
    case "es": return (await import(/* webpackChunkName: "messages-es" */ "./messages/es.json")).default;
    case "et": return (await import(/* webpackChunkName: "messages-et" */ "./messages/et.json")).default;
    case "fr": return (await import(/* webpackChunkName: "messages-fr" */ "./messages/fr.json")).default;
    case "he": return (await import(/* webpackChunkName: "messages-he" */ "./messages/he.json")).default;
    case "hu": return (await import(/* webpackChunkName: "messages-hu" */ "./messages/hu.json")).default;
    case "ja": return (await import(/* webpackChunkName: "messages-ja" */ "./messages/ja.json")).default;
    case "nl": return (await import(/* webpackChunkName: "messages-nl" */ "./messages/nl.json")).default;
    case "pl": return (await import(/* webpackChunkName: "messages-pl" */ "./messages/pl.json")).default;
    case "pt-br": return (await import(/* webpackChunkName: "messages-pt-br" */ "./messages/pt-br.json")).default;
    case "ru": return (await import(/* webpackChunkName: "messages-ru" */ "./messages/ru.json")).default;
    case "sv": return (await import(/* webpackChunkName: "messages-sv" */ "./messages/sv.json")).default;
    case "tr": return (await import(/* webpackChunkName: "messages-tr" */ "./messages/tr.json")).default;
    case "uk": return (await import(/* webpackChunkName: "messages-uk" */ "./messages/uk.json")).default;
    case "zh-Hans": return (await import(/* webpackChunkName: "messages-zh-Hans" */ "./messages/zh-Hans.json")).default;
    default:
      throw new Error();
  }
}
