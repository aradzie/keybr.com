export type LocaleId =
  | "cs"
  | "da"
  | "de"
  | "el"
  | "en"
  | "es"
  | "fr"
  | "he"
  | "hu"
  | "ja"
  | "nl"
  | "pl"
  | "pt-br"
  | "ru"
  | "sv"
  | "tr"
  | "uk"
  | "zh-Hans";

export const allLocales: readonly LocaleId[] = [
  "cs",
  "da",
  "de",
  "el",
  "en",
  "es",
  "fr",
  "he",
  "hu",
  "ja",
  "nl",
  "pl",
  "pt-br",
  "ru",
  "sv",
  "tr",
  "uk",
  "zh-Hans",
];

export const defaultLocale: LocaleId = "en";
