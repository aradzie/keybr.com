import { type LocaleId } from "./locale.ts";

export type Messages = Record<string, string | any>;

export async function loadMessages(locale: LocaleId): Promise<Messages> {
  switch (locale) {
    case "ar":
      return (
        await import(
          /* webpackChunkName: "messages-ar" */ "./messages/ar.json",
          { with: { type: "json" } }
        )
      ).default;
    case "bg":
      return (
        await import(
          /* webpackChunkName: "messages-bg" */ "./messages/bg.json",
          { with: { type: "json" } }
        )
      ).default;
    case "ca":
      return (
        await import(
          /* webpackChunkName: "messages-ca" */ "./messages/ca.json",
          { with: { type: "json" } }
        )
      ).default;
    case "cs":
      return (
        await import(
          /* webpackChunkName: "messages-cs" */ "./messages/cs.json",
          { with: { type: "json" } }
        )
      ).default;
    case "da":
      return (
        await import(
          /* webpackChunkName: "messages-da" */ "./messages/da.json",
          { with: { type: "json" } }
        )
      ).default;
    case "de":
      return (
        await import(
          /* webpackChunkName: "messages-de" */ "./messages/de.json",
          { with: { type: "json" } }
        )
      ).default;
    case "el":
      return (
        await import(
          /* webpackChunkName: "messages-el" */ "./messages/el.json",
          { with: { type: "json" } }
        )
      ).default;
    case "en":
      return (
        await import(
          /* webpackChunkName: "messages-en" */ "./messages/en.json",
          { with: { type: "json" } }
        )
      ).default;
    case "es":
      return (
        await import(
          /* webpackChunkName: "messages-es" */ "./messages/es.json",
          { with: { type: "json" } }
        )
      ).default;
    case "eo":
      return (
        await import(
          /* webpackChunkName: "messages-eo" */ "./messages/eo.json",
          { with: { type: "json" } }
        )
      ).default;
    case "et":
      return (
        await import(
          /* webpackChunkName: "messages-et" */ "./messages/et.json",
          { with: { type: "json" } }
        )
      ).default;
    case "fa":
      return (
        await import(
          /* webpackChunkName: "messages-fa" */ "./messages/fa.json",
          { with: { type: "json" } }
        )
      ).default;
    case "fr":
      return (
        await import(
          /* webpackChunkName: "messages-fr" */ "./messages/fr.json",
          { with: { type: "json" } }
        )
      ).default;
    case "ga":
      return (
        await import(
          /* webpackChunkName: "messages-ga" */ "./messages/ga.json",
          { with: { type: "json" } }
        )
      ).default;
    case "he":
      return (
        await import(
          /* webpackChunkName: "messages-he" */ "./messages/he.json",
          { with: { type: "json" } }
        )
      ).default;
    case "hr":
      return (
        await import(
          /* webpackChunkName: "messages-hr" */ "./messages/hr.json",
          { with: { type: "json" } }
        )
      ).default;
    case "hu":
      return (
        await import(
          /* webpackChunkName: "messages-hu" */ "./messages/hu.json",
          { with: { type: "json" } }
        )
      ).default;
    case "id":
      return (
        await import(
          /* webpackChunkName: "messages-id" */ "./messages/id.json",
          { with: { type: "json" } }
        )
      ).default;
    case "it":
      return (
        await import(
          /* webpackChunkName: "messages-it" */ "./messages/it.json",
          { with: { type: "json" } }
        )
      ).default;
    case "ja":
      return (
        await import(
          /* webpackChunkName: "messages-ja" */ "./messages/ja.json",
          { with: { type: "json" } }
        )
      ).default;
    case "ko":
      return (
        await import(
          /* webpackChunkName: "messages-ko" */ "./messages/ko.json",
          { with: { type: "json" } }
        )
      ).default;
    case "ne":
      return (
        await import(
          /* webpackChunkName: "messages-ne" */ "./messages/ne.json",
          { with: { type: "json" } }
        )
      ).default;
    case "nl":
      return (
        await import(
          /* webpackChunkName: "messages-nl" */ "./messages/nl.json",
          { with: { type: "json" } }
        )
      ).default;
    case "pl":
      return (
        await import(
          /* webpackChunkName: "messages-pl" */ "./messages/pl.json",
          { with: { type: "json" } }
        )
      ).default;
    case "pt-br":
      return (
        await import(
          /* webpackChunkName: "messages-pt-br" */ "./messages/pt-br.json",
          { with: { type: "json" } }
        )
      ).default;
    case "pt-pt":
      return (
        await import(
          /* webpackChunkName: "messages-pt-pt" */ "./messages/pt-pt.json",
          { with: { type: "json" } }
        )
      ).default;
    case "ro":
      return (
        await import(
          /* webpackChunkName: "messages-ro" */ "./messages/ro.json",
          { with: { type: "json" } }
        )
      ).default;
    case "ru":
      return (
        await import(
          /* webpackChunkName: "messages-ru" */ "./messages/ru.json",
          { with: { type: "json" } }
        )
      ).default;
    case "sv":
      return (
        await import(
          /* webpackChunkName: "messages-sv" */ "./messages/sv.json",
          { with: { type: "json" } }
        )
      ).default;
    case "th":
      return (
        await import(
          /* webpackChunkName: "messages-th" */ "./messages/th.json",
          { with: { type: "json" } }
        )
      ).default;
    case "tr":
      return (
        await import(
          /* webpackChunkName: "messages-tr" */ "./messages/tr.json",
          { with: { type: "json" } }
        )
      ).default;
    case "uk":
      return (
        await import(
          /* webpackChunkName: "messages-uk" */ "./messages/uk.json",
          { with: { type: "json" } }
        )
      ).default;
    case "vi":
      return (
        await import(
          /* webpackChunkName: "messages-vi" */ "./messages/vi.json",
          { with: { type: "json" } }
        )
      ).default;
    case "zh-hans":
      return (
        await import(
          /* webpackChunkName: "messages-zh-hans" */ "./messages/zh-hans.json",
          { with: { type: "json" } }
        )
      ).default;
    case "zh-hant":
      return (
        await import(
          /* webpackChunkName: "messages-zh-hant" */ "./messages/zh-hant.json",
          { with: { type: "json" } }
        )
      ).default;
    default:
      throw new Error(
        process.env.NODE_ENV !== "production"
          ? `Unknown locale [${locale}]`
          : undefined,
      );
  }
}
