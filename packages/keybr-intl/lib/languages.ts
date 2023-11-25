import { defineMessages, type MessageDescriptor } from "react-intl";
import { type LocaleId } from "./locale.ts";

export const languageNames = defineMessages({
  be: {
    id: "language.be.name",
    description: "Language name.",
    defaultMessage: "Belarusian (Беларуская)",
  },
  de: {
    id: "language.de.name",
    description: "Language name.",
    defaultMessage: "German (Deutsch)",
  },
  en: {
    id: "language.en.name",
    description: "Language name.",
    defaultMessage: "English",
  },
  es: {
    id: "language.es.name",
    description: "Language name.",
    defaultMessage: "Spanish (Español)",
  },
  fr: {
    id: "language.fr.name",
    description: "Language name.",
    defaultMessage: "French (Français)",
  },
  it: {
    id: "language.it.name",
    description: "Language name.",
    defaultMessage: "Italian (Italiano)",
  },
  pl: {
    id: "language.pl.name",
    description: "Language name.",
    defaultMessage: "Polish (Polski)",
  },
  pt: {
    id: "language.pt.name",
    description: "Language name.",
    defaultMessage: "Portuguese (Português)",
  },
  ru: {
    id: "language.ru.name",
    description: "Language name.",
    defaultMessage: "Russian (Русский)",
  },
  sv: {
    id: "language.sv.name",
    description: "Language name.",
    defaultMessage: "Swedish (Svenska)",
  },
  uk: {
    id: "language.uk.name",
    description: "Language name.",
    defaultMessage: "Ukrainian (Українська)",
  },
}) as Record<LocaleId | string, MessageDescriptor>;

export function languageName(id: LocaleId | string): MessageDescriptor {
  const message = languageNames[id];
  if (message == null) {
    throw new Error(id);
  }
  return message;
}
