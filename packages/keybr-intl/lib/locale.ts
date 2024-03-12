import { createContext, useContext } from "react";

export type LocaleId =
  | "cs"
  | "da"
  | "de"
  | "el"
  | "en"
  | "es"
  | "et"
  | "fr"
  | "he"
  | "hu"
  | "it"
  | "ja"
  | "nl"
  | "pl"
  | "pt-br"
  | "ru"
  | "sv"
  | "tr"
  | "uk"
  | "zh-hans";

export const defaultLocale: LocaleId = "en";

export const allLocales: readonly LocaleId[] = [
  defaultLocale,
  "cs",
  "da",
  "de",
  "el",
  "es",
  "et",
  "fr",
  "he",
  "hu",
  "it",
  "ja",
  "nl",
  "pl",
  "pt-br",
  "ru",
  "sv",
  "tr",
  "uk",
  "zh-hans",
];

export function getDir(locale: LocaleId): "rtl" | "ltr" {
  return locale === "he" ? "rtl" : "ltr";
}

export const PreferredLocaleContext = createContext<LocaleId>(defaultLocale);

export function usePreferredLocale(): LocaleId {
  return useContext(PreferredLocaleContext);
}

const map = (() => {
  const map = new Map<string, LocaleId>();

  // Append the default region to a language.
  // This will add "en" as "en-US", "pt-BR" as "pt-BR",
  // "zh-Hans" as "zh-CN", "zh-Hant" as "zh-TW", etc.
  for (const id of allLocales) {
    const locale = new Intl.Locale(id).maximize();
    map.set(locale.language + "-" + locale.region, id);
  }

  // Append languages only.
  for (const id of allLocales) {
    const locale = new Intl.Locale(id);
    if (locale.region == null) {
      map.set(locale.language, id);
    }
  }

  return map;
})();

export function selectLocale(
  filter: (...locales: readonly string[]) => string | null,
): LocaleId {
  return map.get(filter(...map.keys()) ?? "") ?? defaultLocale;
}
