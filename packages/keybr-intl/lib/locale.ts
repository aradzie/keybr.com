export type LocaleId =
  | "cs"
  | "de"
  | "en"
  | "es"
  | "fr"
  | "ja"
  | "pl"
  | "ru"
  | "sv"
  | "uk";

export const allLocales: readonly LocaleId[] = [
  "cs",
  "de",
  "en",
  "es",
  "fr",
  "ja",
  "pl",
  "ru",
  "sv",
  "uk",
];

export const defaultLocale: LocaleId = "en";
