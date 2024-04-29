"use strict";

const { compile, extract } = require("@formatjs/cli-lib");
const { globSync } = require("glob");
const { join } = require("node:path");
const { readJsonSync, writeJsonSync } = require("./lib/fs.js");
const { getHashDigest } = require("./lib/intl.js");
const { rootDir, findPackages } = require("./root.js");
const { writeFileSync } = require("node:fs");

const packageDir = join(rootDir, "packages/keybr-intl");

const allLocales = [
  "ar",
  "cs",
  "da",
  "de",
  "el",
  "en",
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

const defaultLocale = "en";

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

async function syncTranslations(report) {
  const defaultTranslationsFile = translationsPath(defaultLocale);
  const defaultTranslations = readJsonSync(defaultTranslationsFile);
  for (const locale of allLocales) {
    if (locale === defaultLocale) {
      continue;
    }
    const localeReport = (report[locale] = {
      translated: [],
      untranslated: [],
    });
    const translationsFile = translationsPath(locale);
    const translations = readJsonSync(translationsFile);
    writeJsonSync(
      translationsFile,
      remap(defaultTranslations, ([id, message]) => {
        const translatedMessage =
          translations[id] !== "" &&
          translations[id] !== id &&
          translations[id] !== message
            ? translations[id]
            : undefined;
        if (translatedMessage != null) {
          localeReport.translated.push([id, message]);
        } else {
          localeReport.untranslated.push([id, message]);
        }
        return [id, translatedMessage];
      }),
    );
  }
}

async function compileMessages() {
  const defaultTranslationsFile = translationsPath(defaultLocale);
  const defaultTranslations = readJsonSync(defaultTranslationsFile);

  const format = {
    compile: (translations) => {
      return remap(translations, ([id, message]) => [
        getHashDigest(id),
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
        translations[id] ?? message,
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

async function writeReport(report) {
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
    lines.push(``);
  }
  writeFileSync(join(rootDir, "docs/translations_report.md"), lines.join("\n"));
}

async function run() {
  const report = {};
  await extractTranslations();
  await syncTranslations(report);
  await compileMessages();
  await writeReport(report);
}

function remap(entries, callback) {
  return Object.fromEntries(Object.entries(entries).map(callback));
}

function translationsPath(locale) {
  return join(packageDir, `translations/${locale}.json`);
}

function mergedTranslationsPath(locale) {
  return join(packageDir, `translations/${locale}-merged.json`);
}

function messagesPath(locale) {
  return join(packageDir, `lib/messages/${locale}.json`);
}

run().catch((err) => {
  console.error(err);
});
