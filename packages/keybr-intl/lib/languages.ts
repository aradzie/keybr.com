import { defineMessages, type MessageDescriptor } from "react-intl";
import { type LocaleId } from "./locale.ts";

export const languageNames = defineMessages({
  "be": {
    id: "language.be.name",
    defaultMessage: "Belarusian (Беларуская)",
  },
  "cs": {
    id: "language.cs.name",
    defaultMessage: "Czech (Čeština)",
  },
  "de": {
    id: "language.de.name",
    defaultMessage: "German (Deutsch)",
  },
  "en": {
    id: "language.en.name",
    defaultMessage: "English",
  },
  "es": {
    id: "language.es.name",
    defaultMessage: "Spanish (Español)",
  },
  "fr": {
    id: "language.fr.name",
    defaultMessage: "French (Français)",
  },
  "ja": {
    id: "language.ja.name",
    defaultMessage: "Japanese (日本語)",
  },
  "it": {
    id: "language.it.name",
    defaultMessage: "Italian (Italiano)",
  },
  "pl": {
    id: "language.pl.name",
    defaultMessage: "Polish (Polski)",
  },
  "pt": {
    id: "language.pt.name",
    defaultMessage: "Portuguese (Português)",
  },
  "ru": {
    id: "language.ru.name",
    defaultMessage: "Russian (Русский)",
  },
  "sl": {
    id: "language.sl.name",
    defaultMessage: "Slovenian (Slovenščina)",
  },
  "sv": {
    id: "language.sv.name",
    defaultMessage: "Swedish (Svenska)",
  },
  "uk": {
    id: "language.uk.name",
    defaultMessage: "Ukrainian (Українська)",
  },
  "zh-Hans": {
    id: "language.zh-Hans.name",
    defaultMessage: "Chinese Simplified (汉语)",
  },
}) as Record<LocaleId | string, MessageDescriptor>;

export function languageName(id: LocaleId | string): MessageDescriptor {
  const message = languageNames[id];
  if (message == null) {
    throw new Error(id);
  }
  return message;
}
