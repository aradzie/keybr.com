import { readFileSync } from "node:fs";
import { test } from "node:test";
import { deepEqual, doesNotMatch } from "rich-assert";
import { allLocales, defaultLocale } from "./locale.ts";

for (const locale of allLocales) {
  if (locale !== defaultLocale) {
    test(`placeholders [${locale}]`, () => {
      const messages0 = loadTranslations(defaultLocale);
      const messages1 = loadTranslations(locale);
      for (const [id, message0] of Object.entries(messages0)) {
        const message1 = messages1[id];
        if (message1) {
          deepEqual(
            findPlaceholders(message0),
            findPlaceholders(message1),
            `Message ${id} has invalid placeholders`,
          );
        }
      }
    });
  }
}

for (const locale of allLocales) {
  test(`typography [${locale}]`, () => {
    const messages = loadTranslations(locale);
    for (const [id, message] of Object.entries(messages)) {
      doesNotMatch(message, /^\s/, `Message ${id} starts with whitespace`);
      doesNotMatch(message, /\s$/, `Message ${id} ends with whitespace`);
      doesNotMatch(message, /\s\s/, `Message ${id} has repeated whitespace`);
      doesNotMatch(message, /\t/, `Message ${id} has tab whitespace`);
      doesNotMatch(
        message,
        /[\u2000-\u200B\u2028\u2029]/,
        `Message ${id} has irregular whitespace`,
      );
      doesNotMatch(
        message,
        /\s[.,:;!?]/,
        `Message ${id} has whitespace before punctuation`,
      );
      doesNotMatch(message, /'/, `Message ${id} has straight single quote`);
      doesNotMatch(message, /"/, `Message ${id} has straight double quote`);
      doesNotMatch(
        message,
        /\s\u002D\s/,
        `Message ${id} uses Hyphen-Minus as Dash`,
      );
      doesNotMatch(
        message,
        /\s\u2010|\u2010\s/,
        `Message ${id} has space around Hyphen`,
      );
      doesNotMatch(
        message,
        /\s\u2011|\u2011\s/,
        `Message ${id} has space around Non-Breaking Hyphen`,
      );
    }
  });
}

function loadTranslations(locale: string): Record<string, string> {
  return JSON.parse(
    readFileSync(
      `${import.meta.dirname}/../translations/${locale}.json`,
      "utf-8",
    ),
  );
}

function findPlaceholders(value: string): unknown {
  const placeholders = new Set();
  const regexp = /\{([a-z]+)[,}]/gu;
  while (true) {
    const match = regexp.exec(value);
    if (match == null) {
      break;
    }
    placeholders.add(match[1]);
  }
  return [...placeholders].sort();
}
