import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { compile, extract } from "@formatjs/cli-lib";
import { globSync } from "glob";
import { readJsonSync, writeJsonSync } from "./lib/fs-json.js";
import { messageIdHash } from "./lib/intl.js";
import {
  mergedTranslationsPath,
  messagesPath,
  translationsPath,
} from "./lib/intl-io.js";
import { allLocales, defaultLocale } from "./locale.js";
import { findPackages, rootDir } from "./root.js";

function findSourceFiles() {
  const files = [];
  for (const packageDirectory of findPackages()) {
    for (const file of globSync(["lib/**/*.@(ts|tsx)"], {
      cwd: packageDirectory,
      absolute: true,
      ignore: ["**/*.d.ts", "**/test/*", "**/*.test.*"],
    })) {
      files.push(file);
    }
  }
  files.sort();
  return files;
}

async function extractTranslations() {
  const defaultTranslationsFile = translationsPath(defaultLocale);
  const defaultTranslations = JSON.parse(
    await extract(findSourceFiles(), {
      additionalFunctionNames: [],
      additionalComponentNames: [],
      preserveWhitespace: true,
    }),
  );
  writeJsonSync(
    defaultTranslationsFile,
    remap(defaultTranslations, ([id, { defaultMessage }]) => [
      id,
      defaultMessage,
    ]),
  );
}

async function syncTranslations() {
  const defaultTranslationsFile = translationsPath(defaultLocale);
  const defaultTranslations = readJsonSync(defaultTranslationsFile);
  for (const locale of allLocales) {
    if (locale === defaultLocale) {
      continue;
    }
    const translationsFile = translationsPath(locale);
    const translations = readJsonSync(translationsFile);
    writeJsonSync(
      translationsFile,
      remap(defaultTranslations, ([id, message]) => [
        id,
        translations[id] &&
        translations[id] !== id &&
        translations[id] !== message
          ? translations[id]
          : undefined,
      ]),
    );
  }
}

async function compileMessages() {
  const defaultTranslationsFile = translationsPath(defaultLocale);
  const defaultTranslations = readJsonSync(defaultTranslationsFile);

  const format = {
    compile: (translations) => {
      return remap(translations, ([id, message]) => [
        messageIdHash(id),
        message,
      ]);
    },
  };

  for (const locale of allLocales) {
    const translationsFile = translationsPath(locale);
    const translations = readJsonSync(translationsFile);
    const mergedTranslationsFile = mergedTranslationsPath(locale);
    writeJsonSync(
      mergedTranslationsFile,
      remap(defaultTranslations, ([id, message]) => [
        id,
        translations[id] || message,
      ]),
    );
    const messagesFile = messagesPath(locale);
    const messages = JSON.parse(
      await compile([mergedTranslationsFile], {
        ast: true,
        format,
      }),
    );
    writeJsonSync(messagesFile, messages, null);
  }
}

async function writeReport() {
  const report = {};
  const defaultTranslationsFile = translationsPath(defaultLocale);
  const defaultTranslations = readJsonSync(defaultTranslationsFile);
  for (const locale of allLocales) {
    const translationsFile = translationsPath(locale);
    const translations = readJsonSync(translationsFile);
    const localeReport = (report[locale] = {
      translated: [],
      untranslated: [],
    });
    for (const [id, message] of Object.entries(defaultTranslations)) {
      if (translations[id]) {
        localeReport.translated.push([id, message]);
      } else if (!/\{[a-z]+\}/.test(message)) {
        localeReport.untranslated.push([id, message]);
      }
    }
  }
  const languageName = new Intl.DisplayNames("en", { type: "language" });
  const countWords = (count, [id, message]) =>
    count +
    message
      .replaceAll(/\{[a-zA-Z]}+/g, "")
      .replaceAll(/<\/?[a-z]+>/g, "")
      .match(/\p{L}+/gu).length;
  const lines = [];
  for (const [locale, { translated, untranslated }] of Object.entries(report)) {
    lines.push(`# ${languageName.of(locale)}`);
    lines.push(``);
    lines.push(
      `Translated: ` +
        `${translated.length} messages, ` +
        `${translated.reduce(countWords, 0)} words`,
    );
    lines.push(``);
    lines.push(
      `Untranslated: ` +
        `${untranslated.length} messages, ` +
        `${untranslated.reduce(countWords, 0)} words`,
    );
    if (untranslated.length > 0) {
      untranslated.sort((a, b) => a[1].length - b[1].length);
      const head = untranslated.slice(0, 20);
      lines.push(``);
      for (const [id, message] of head) {
        const prefix = message.substring(0, 60);
        if (message.length > prefix.length) {
          lines.push(`* *${prefix}...*`);
        } else {
          lines.push(`* *${prefix}*`);
        }
      }
      if (untranslated.length > head.length) {
        lines.push(`* ...`);
      }
    }
    lines.push(``);
  }
  writeFileSync(
    join(rootDir, "docs", "translations_report.md"),
    lines.join("\n"),
  );
}

function remap(entries, callback) {
  return Object.fromEntries(Object.entries(entries).map(callback));
}

await extractTranslations();
await syncTranslations();
await compileMessages();
await writeReport();
