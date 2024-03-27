import { readFileSync } from "@sosimple/fsx";
import test from "ava";
import { allLocales, defaultLocale } from "./locale.ts";

for (const locale of allLocales) {
  if (locale !== defaultLocale) {
    test(`placeholders [${locale}]`, (t) => {
      const messages0 = loadMessages(defaultLocale);
      const messages1 = loadMessages(locale);
      for (const [id, message0] of Object.entries(messages0)) {
        const message1 = messages1[id];
        if (message1) {
          t.deepEqual(
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
  test(`typography [${locale}]`, (t) => {
    const messages = loadMessages(locale);
    let text = "";
    for (const [id, message] of Object.entries(messages)) {
      t.notRegex(message, /^\s+/, `Message ${id} starts with whitespace`);
      t.notRegex(message, /\s+$/, `Message ${id} ends with whitespace`);
      t.notRegex(message, /\s{2,}/, `Message ${id} has repeated whitespace`);
      t.notRegex(message, /\t/, `Message ${id} has tab whitespace`);
      t.notRegex(
        message,
        /[\u2000-\u200B\u2028\u2029]/,
        `Message ${id} has irregular whitespace`,
      );
      // - \u002D Hyphen-Minus
      // ‐ \u2010 Hyphen
      // ‑ \u2011 Non-Breaking Hyphen
      // ‒ \u2012 Figure Dash
      // – \u2013 En Dash
      // — \u2014 Em Dash
      // − \u2212 Minus Sign
      t.notRegex(
        message,
        /\s\u002D\s/,
        `Message ${id} uses Hyphen-Minus as Dash`,
      );
      t.notRegex(
        message,
        /\s\u2010|\u2010\s/,
        `Message ${id} has space around Hyphen`,
      );
      t.notRegex(
        message,
        /\s\u2011|\u2011\s/,
        `Message ${id} has space around Non-Breaking Hyphen`,
      );
      text += message;
    }
    // https://op.europa.eu/en/web/eu-vocabularies/formex/physical-specifications/character-encoding/use-of-quotation-marks-in-the-different-languages
    const a = text.includes("«") || text.includes("»");
    const b = text.includes("„") || text.includes("“") || text.includes("”");
    const c = text.includes("‘") || text.includes("’");
    t.false(
      (a && b) || (b && c) || (a && c),
      "Messages have mixed quote characters",
    );
  });
}

function loadMessages(locale: string): Record<string, string> {
  return JSON.parse(
    readFileSync(`${__dirname}/../translations/${locale}.json`, "utf-8"),
  );
}

function findPlaceholders(value: string): unknown {
  const placeholders = new Set();
  const regexp = /\{(\p{L})+\}/gu;
  while (true) {
    const match = regexp.exec(value);
    if (match == null) {
      break;
    }
    placeholders.add(match[0]);
  }
  return [...placeholders].sort();
}
