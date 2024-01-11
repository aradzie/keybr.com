export type LocaleId =
  | "cs"
  | "da"
  | "de"
  | "en"
  | "es"
  | "fr"
  | "ja"
  | "pl"
  | "ru"
  | "sv"
  | "uk"
  | "zh-Hans";

export const allLocales: readonly LocaleId[] = [
  "cs",
  "da",
  "de",
  "en",
  "es",
  "fr",
  "ja",
  "pl",
  "ru",
  "sv",
  "uk",
  "zh-Hans",
];

export const defaultLocale: LocaleId = "en";
