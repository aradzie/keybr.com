import { readFileSync } from "@sosimple/fsx";
import test from "ava";
import { allLocales, defaultLocale } from "./locale.ts";

for (const locale of allLocales) {
  if (locale !== defaultLocale) {
    test(`translations [${locale}]`, (t) => {
      const messages0 = loadMessages(defaultLocale);
      const messages1 = loadMessages(locale);
      for (const [id, message0] of Object.entries(messages0)) {
        const message1 = messages1[id];
        if (message1) {
          t.deepEqual(
            findPlaceholders(message0),
            findPlaceholders(message1),
            `Messages [${id}] do not match`,
          );
        }
      }
    });
  }
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
