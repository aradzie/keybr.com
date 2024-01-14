#!/usr/bin/env -S node -r @keybr/tsl

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { gunzipSync } from "node:zlib";
import { TransitionTableBuilder } from "./builder.ts";
import { type Language, languages } from "./languages.ts";
import { checkWord, fromCsv, sortByCount, type Word } from "./words.ts";

for (const language of languages) {
  generate(language);
}

function generate({ id, alphabet }: Language): void {
  const dict = readDict({ id, alphabet });
  if (dict != null) {
    generateModel({ id, alphabet }, dict);
    generateWordList(
      id,
      sortByCount(dict)
        .slice(0, 3000)
        .map(([word]) => word),
    );
  }
}

function generateModel({ id, alphabet }: Language, dict: Word[]): void {
  const builder = new TransitionTableBuilder(4, [0x0020, ...alphabet]);
  for (const [word, count] of dict) {
    if (word.length >= 3) {
      for (let i = 0; i < count; i++) {
        builder.append(word.toLocaleLowerCase(id));
      }
    }
  }
  const data = builder.build().compress();
  writeFileSync(modelPath(id), data);
  console.log(`[${id}] Generated model (${data.length} bytes)`);
}

function generateWordList(id: string, words: string[]): void {
  const prev = readWordsJson(id);
  if (prev.length > 0) {
    const added = [];
    for (const item of words) {
      if (!prev.includes(item)) {
        added.push(item);
      }
    }
    const deleted = [];
    for (const item of prev) {
      if (!words.includes(item)) {
        deleted.push(item);
      }
    }
    if (added.length > 0) {
      console.log(
        `[${id}] Added words:`,
        "\x1b[32m",
        ...added.sort(),
        "\x1b[0m",
      );
    }
    if (deleted.length > 0) {
      console.log(
        `[${id}] Deleted words:`,
        "\x1b[31m",
        ...deleted.sort(),
        "\x1b[0m",
      );
    }
  }
  writeWordsJson(id, words);
  console.log(`[${id}] Generated word list (${words.length} words)`);
}

function readDict({ id, alphabet }: Language): Word[] | null {
  const data = readCompressed(dictPath(id));
  if (data != null) {
    const unique = new Set();
    const dict = fromCsv(data)
      .filter(([word]) => {
        if (checkWord(word.toLocaleLowerCase(id), alphabet)) {
          return true;
        } else {
          console.warn(`[${id}] Extraneous word [${word}]`);
          return false;
        }
      })
      .filter(([word]) => {
        if (!unique.has(word)) {
          unique.add(word);
          return true;
        } else {
          console.warn(`[${id}] Duplicate word [${word}]`);
          return false;
        }
      });
    console.log(`[${id}] ${dict.length} unique words`);
    return dict;
  }
  return null;
}

function readWordsJson(id: string): string[] {
  try {
    return JSON.parse(readFileSync(wordsListPath(id)).toString("utf-8"));
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }

  return [];
}

function writeWordsJson(id: string, words: readonly string[]): void {
  writeFileSync(wordsListPath(id), JSON.stringify(words, null, 2));
}

function readCompressed(path: string): string | null {
  try {
    return gunzipSync(readFileSync(`${path}.gz`)).toString("utf-8");
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }

  try {
    return readFileSync(path).toString("utf-8");
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }

  return null;
}

function dictPath(id: string): string {
  return resolve(__dirname, "corpus", `words-${id}.csv`);
}

function modelPath(id: string): string {
  return resolve(
    __dirname,
    "..",
    "..",
    "..",
    "keybr-phonetic-model",
    "assets",
    `lang-${id}.data`,
  );
}

function wordsListPath(id: string): string {
  return resolve(
    __dirname,
    "..",
    "..",
    "..",
    "keybr-content-words",
    "lib",
    "data",
    `words-${id}.json`,
  );
}
