import { type LocaleId } from "./locale.ts";

export type Messages = Record<string, string | any>;

export async function loadMessages(locale: LocaleId): Promise<Messages> {
  // prettier-ignore
  switch (locale) {
    case "ar": return (await import(/* webpackChunkName: "messages-ar" */ "./messages/ar.json", { with: { type: "json" }}));
    case "bg": return (await import(/* webpackChunkName: "messages-bg" */ "./messages/bg.json", { with: { type: "json" }}));
    case "ca": return (await import(/* webpackChunkName: "messages-ca" */ "./messages/ca.json", { with: { type: "json" }}));
    case "cs": return (await import(/* webpackChunkName: "messages-cs" */ "./messages/cs.json", { with: { type: "json" }}));
    case "da": return (await import(/* webpackChunkName: "messages-da" */ "./messages/da.json", { with: { type: "json" }}));
    case "de": return (await import(/* webpackChunkName: "messages-de" */ "./messages/de.json", { with: { type: "json" }}));
    case "el": return (await import(/* webpackChunkName: "messages-el" */ "./messages/el.json", { with: { type: "json" }}));
    case "en": return (await import(/* webpackChunkName: "messages-en" */ "./messages/en.json", { with: { type: "json" }}));
    case "es": return (await import(/* webpackChunkName: "messages-es" */ "./messages/es.json", { with: { type: "json" }}));
    case "eo": return (await import(/* webpackChunkName: "messages-eo" */ "./messages/eo.json", { with: { type: "json" }}));
    case "et": return (await import(/* webpackChunkName: "messages-et" */ "./messages/et.json", { with: { type: "json" }}));
    case "fa": return (await import(/* webpackChunkName: "messages-fa" */ "./messages/fa.json", { with: { type: "json" }}));
    case "fr": return (await import(/* webpackChunkName: "messages-fr" */ "./messages/fr.json", { with: { type: "json" }}));
    case "he": return (await import(/* webpackChunkName: "messages-he" */ "./messages/he.json", { with: { type: "json" }}));
    case "hr": return (await import(/* webpackChunkName: "messages-hr" */ "./messages/hr.json", { with: { type: "json" }}));
    case "hu": return (await import(/* webpackChunkName: "messages-hu" */ "./messages/hu.json", { with: { type: "json" }}));
    case "id": return (await import(/* webpackChunkName: "messages-id" */ "./messages/id.json", { with: { type: "json" }}));
    case "it": return (await import(/* webpackChunkName: "messages-it" */ "./messages/it.json", { with: { type: "json" }}));
    case "ja": return (await import(/* webpackChunkName: "messages-ja" */ "./messages/ja.json", { with: { type: "json" }}));
    case "ko": return (await import(/* webpackChunkName: "messages-ko" */ "./messages/ko.json", { with: { type: "json" }}));
    case "ne": return (await import(/* webpackChunkName: "messages-ne" */ "./messages/ne.json", { with: { type: "json" }}));
    case "nl": return (await import(/* webpackChunkName: "messages-nl" */ "./messages/nl.json", { with: { type: "json" }}));
    case "pl": return (await import(/* webpackChunkName: "messages-pl" */ "./messages/pl.json", { with: { type: "json" }}));
    case "pt-br": return (await import(/* webpackChunkName: "messages-pt-br" */ "./messages/pt-br.json", { with: { type: "json" }}));
    case "pt-pt": return (await import(/* webpackChunkName: "messages-pt-pt" */ "./messages/pt-pt.json", { with: { type: "json" }}));
    case "ro": return (await import(/* webpackChunkName: "messages-ro" */ "./messages/ro.json", { with: { type: "json" }}));
    case "ru": return (await import(/* webpackChunkName: "messages-ru" */ "./messages/ru.json", { with: { type: "json" }}));
    case "sv": return (await import(/* webpackChunkName: "messages-sv" */ "./messages/sv.json", { with: { type: "json" }}));
    case "th": return (await import(/* webpackChunkName: "messages-th" */ "./messages/th.json", { with: { type: "json" }}));
    case "tr": return (await import(/* webpackChunkName: "messages-tr" */ "./messages/tr.json", { with: { type: "json" }}));
    case "uk": return (await import(/* webpackChunkName: "messages-uk" */ "./messages/uk.json", { with: { type: "json" }}));
    case "vi": return (await import(/* webpackChunkName: "messages-vi" */ "./messages/vi.json", { with: { type: "json" }}));
    case "zh-hans": return (await import(/* webpackChunkName: "messages-zh-hans" */ "./messages/zh-hans.json", { with: { type: "json" }}));
    case "zh-hant": return (await import(/* webpackChunkName: "messages-zh-hant" */ "./messages/zh-hant.json", { with: { type: "json" }}));
    default:
      throw new Error(
        process.env.NODE_ENV !== "production"
          ? `Unknown locale [${locale}]`
          : undefined,
      );
  }
}
