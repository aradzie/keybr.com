import { join } from "node:path";
import { rootDir } from "../root.js";

const outputDir = join(rootDir, "packages", "keybr-intl");

export function translationsPath(locale) {
  return join(outputDir, `translations`, `${locale}.json`);
}

export function mergedTranslationsPath(locale) {
  return join(outputDir, `translations`, `${locale}-merged.json`);
}

export function messagesPath(locale) {
  return join(outputDir, `lib`, `messages`, `${locale}.json`);
}
