import { createContext, useContext } from "react";

/*
 * Locale identifier is a triple "language[-script][-region]".
 *
 * Examples are:
 *
 * - "en" -- English.
 * - "en-US" -- English, United States.
 * - "en-CA" -- English, Canada.
 * - "zh-Hans" Chinese, Simplified Script.
 * - "zh-Hant" Chinese, Traditional Script.
 * - "zh-CN" Chinese, China.
 * - "zh-TW" Chinese, Taiwan.
 * - "zh-Hans-CN" Chinese, Simplified Script, China.
 * - "zh-Hant-TW" Chinese, Traditional Script, Taiwan.
 *
 * @see https://www.w3.org/International/articles/bcp47/
 * @see https://www.rfc-editor.org/rfc/rfc5646.txt
 */

export type LocaleId =
  | "ar"
  | "cs"
  | "da"
  | "de"
  | "el"
  | "en"
  | "es"
  | "et"
  | "fa"
  | "fr"
  | "he"
  | "hu"
  | "id"
  | "it"
  | "ja"
  | "ne"
  | "nl"
  | "pl"
  | "pt-br"
  | "pt-pt"
  | "ru"
  | "sv"
  | "tr"
  | "uk"
  | "vi"
  | "zh-hans"
  | "zh-hant";

export const defaultLocale: LocaleId = "en";

export const allLocales: readonly LocaleId[] = [
  defaultLocale,
  "ar",
  "cs",
  "da",
  "de",
  "el",
  "es",
  "et",
  "fa",
  "fr",
  "he",
  "hu",
  "id",
  "it",
  "ja",
  "ne",
  "nl",
  "pl",
  "pt-br",
  "pt-pt",
  "ru",
  "sv",
  "tr",
  "uk",
  "vi",
  "zh-hans",
  "zh-hant",
];

export function getDir(locale: LocaleId): "ltr" | "rtl" {
  switch (locale) {
    case "ar":
    case "fa":
    case "he":
      return "rtl";
    default:
      return "ltr";
  }
}

export const PreferredLocaleContext = createContext<LocaleId>(defaultLocale);

export function usePreferredLocale(): LocaleId {
  return useContext(PreferredLocaleContext);
}

const map = (() => {
  const tmp = new Map<string, LocaleId>();
  for (const id of allLocales) {
    const { language, region } = new Intl.Locale(id).maximize();
    tmp.set(language + "-" + region, id);
    if (!tmp.has(language)) {
      tmp.set(language, id);
    }
  }
  return tmp;
})();

export function selectLocale(
  filter: (...locales: readonly string[]) => string | null,
): LocaleId {
  return map.get(filter(...map.keys()) ?? "") ?? defaultLocale;
}
