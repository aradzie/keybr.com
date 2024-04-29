import { type LocaleId } from "./locale.ts";

export type Messages = Record<string, string | any>;

export async function loadMessages(locale: LocaleId): Promise<Messages> {
  // prettier-ignore
  switch (locale) {
    case "ar": return (await import(/* webpackChunkName: "messages-ar" */ "./messages/ar.json")).default;
    case "cs": return (await import(/* webpackChunkName: "messages-cs" */ "./messages/cs.json")).default;
    case "da": return (await import(/* webpackChunkName: "messages-da" */ "./messages/da.json")).default;
    case "de": return (await import(/* webpackChunkName: "messages-de" */ "./messages/de.json")).default;
    case "el": return (await import(/* webpackChunkName: "messages-el" */ "./messages/el.json")).default;
    case "en": return (await import(/* webpackChunkName: "messages-en" */ "./messages/en.json")).default;
    case "es": return (await import(/* webpackChunkName: "messages-es" */ "./messages/es.json")).default;
    case "et": return (await import(/* webpackChunkName: "messages-et" */ "./messages/et.json")).default;
    case "fa": return (await import(/* webpackChunkName: "messages-fa" */ "./messages/fa.json")).default;
    case "fr": return (await import(/* webpackChunkName: "messages-fr" */ "./messages/fr.json")).default;
    case "he": return (await import(/* webpackChunkName: "messages-he" */ "./messages/he.json")).default;
    case "hu": return (await import(/* webpackChunkName: "messages-hu" */ "./messages/hu.json")).default;
    case "id": return (await import(/* webpackChunkName: "messages-hu" */ "./messages/id.json")).default;
    case "it": return (await import(/* webpackChunkName: "messages-it" */ "./messages/it.json")).default;
    case "ja": return (await import(/* webpackChunkName: "messages-ja" */ "./messages/ja.json")).default;
    case "ne": return (await import(/* webpackChunkName: "messages-ne" */ "./messages/ne.json")).default;
    case "nl": return (await import(/* webpackChunkName: "messages-nl" */ "./messages/nl.json")).default;
    case "pl": return (await import(/* webpackChunkName: "messages-pl" */ "./messages/pl.json")).default;
    case "pt-br": return (await import(/* webpackChunkName: "messages-pt-br" */ "./messages/pt-br.json")).default;
    case "pt-pt": return (await import(/* webpackChunkName: "messages-pt-pt" */ "./messages/pt-pt.json")).default;
    case "ru": return (await import(/* webpackChunkName: "messages-ru" */ "./messages/ru.json")).default;
    case "sv": return (await import(/* webpackChunkName: "messages-sv" */ "./messages/sv.json")).default;
    case "tr": return (await import(/* webpackChunkName: "messages-tr" */ "./messages/tr.json")).default;
    case "uk": return (await import(/* webpackChunkName: "messages-uk" */ "./messages/uk.json")).default;
    case "vi": return (await import(/* webpackChunkName: "messages-vi" */ "./messages/vi.json")).default;
    case "zh-hans": return (await import(/* webpackChunkName: "messages-zh-hans" */ "./messages/zh-hans.json")).default;
    case "zh-hant": return (await import(/* webpackChunkName: "messages-zh-hant" */ "./messages/zh-hant.json")).default;
    default:
      throw new Error();
  }
}
