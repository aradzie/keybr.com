import { readFileSync } from "node:fs";
import { test } from "node:test";
import { assert } from "chai";
import { allLocales, defaultLocale } from "./locale.ts";

for (const locale of allLocales) {
  if (locale !== defaultLocale) {
    test(`placeholders [${locale}]`, () => {
      const messages0 = loadTranslations(defaultLocale);
      const messages1 = loadTranslations(locale);
      for (const [id, message0] of Object.entries(messages0)) {
        const message1 = messages1[id];
        if (message1) {
          assert.deepStrictEqual(
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
      assert.notMatch(message, /^\s/, `Message ${id} starts with whitespace`);
      assert.notMatch(message, /\s$/, `Message ${id} ends with whitespace`);
      assert.notMatch(message, /\s\s/, `Message ${id} has repeated whitespace`);
      assert.notMatch(message, /\t/, `Message ${id} has tab whitespace`);
      assert.notMatch(
        message,
        /[\u2000-\u200B\u2028\u2029]/,
        `Message ${id} has irregular whitespace`,
      );
      assert.notMatch(
        message,
        /\s[.,:;!?]/,
        `Message ${id} has whitespace before punctuation`,
      );
      assert.notMatch(message, /'/, `Message ${id} has straight single quote`);
      assert.notMatch(message, /"/, `Message ${id} has straight double quote`);
      assert.notMatch(
        message,
        /\s\u002D\s/,
        `Message ${id} uses Hyphen-Minus as Dash`,
      );
      assert.notMatch(
        message,
        /\s\u2010|\u2010\s/,
        `Message ${id} has space around Hyphen`,
      );
      assert.notMatch(
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
