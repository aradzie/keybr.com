"use strict";

const { compile, extract } = require("@formatjs/cli-lib");
const { globSync } = require("glob");
const { join } = require("node:path");
const { readJsonSync, writeJsonSync } = require("./lib/fs.js");
const { getHashDigest } = require("./lib/message-id.js");
const { rootDir, findPackages } = require("./root.js");

const packageDir = join(rootDir, "packages/keybr-intl");

const allLocales = ["de", "en", "es", "fr", "pl", "ru"];

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
  const defaultTranslations = await extract(findSourceFiles(), {
    additionalFunctionNames: [],
    additionalComponentNames: [],
    preserveWhitespace: true,
  });
  writeJsonSync(defaultTranslationsFile, JSON.parse(defaultTranslations));
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
    const entries = [];
    for (const [id, defaultTranslation] of Object.entries(
      defaultTranslations,
    )) {
      const translation = translations[id] ?? {
        defaultMessage: defaultTranslation.defaultMessage,
        description: defaultTranslation.description,
      };
      entries.push([
        id,
        {
          defaultMessage: translation.defaultMessage,
          description: defaultTranslation.description,
        },
      ]);
      if (defaultTranslation.defaultMessage === translation.defaultMessage) {
        console.warn(`Not translated [${locale}:${id}].`);
      }
    }
    writeJsonSync(translationsFile, Object.fromEntries(entries));
  }
}

async function compileMessages() {
  const format = {
    compile: (translations) => {
      return Object.fromEntries(
        Object.entries(translations).map(([id, { defaultMessage }]) => [
          getHashDigest(id),
          defaultMessage,
        ]),
      );
    },
  };

  for (const locale of allLocales) {
    const translationsFile = translationsPath(locale);
    const messagesFile = messagesPath(locale);
    const messages = JSON.parse(
      await compile([translationsFile], {
        ast: true,
        format,
      }),
    );
    writeJsonSync(messagesFile, messages, null);
  }
}

async function run() {
  await extractTranslations();
  await syncTranslations();
  await compileMessages();
}

function translationsPath(locale) {
  return join(packageDir, `translations/${locale}.json`);
}

function messagesPath(locale) {
  return join(packageDir, `lib/messages/${locale}.json`);
}

run().catch((err) => {
  console.error(err);
});
