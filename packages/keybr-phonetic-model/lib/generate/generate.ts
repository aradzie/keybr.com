#!/usr/bin/env -S node -r @keybr/tsl

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { gunzipSync, gzipSync } from "node:zlib";
import { type CodePoint } from "@keybr/unicode";
import { TransitionTableBuilder } from "./builder.ts";
import { languages } from "./languages.ts";
import { findWords, fromCsv, sortByCount, toCsv, type Word } from "./words.ts";

for (const { id, alphabet } of languages) {
  generateWords(id, alphabet);
  generateModel(id, alphabet);
}

function generateWords(id: string, alphabet: readonly CodePoint[]): void {
  const data = readCompressed(corpusPath(id));
  if (data != null) {
    writeCompressed(wordsPath(id), toCsv(findWords(data, alphabet)));
    console.log(`Generated words ${id}`);
  }
}

function generateModel(id: string, alphabet: readonly CodePoint[]): void {
  const data = readCompressed(wordsPath(id));
  if (data != null) {
    const words = fromCsv(data);
    writeModelFile(id, alphabet, words);
    writeWordsJsonFile(
      id,
      sortByCount(words)
        .slice(0, 3000)
        .map(([word]) => word),
    );
    console.log(`${words.length} unique words`);
  }
}

function writeModelFile(
  id: string,
  alphabet: readonly CodePoint[],
  words: Word[],
): void {
  const builder = new TransitionTableBuilder(4, [0x0020, ...alphabet]);
  for (const [word, count] of words) {
    if (word.length >= 3) {
      for (let i = 0; i < count; i++) {
        builder.append(word);
      }
    }
  }
  writeFileSync(modelPath(id), builder.build().compress());
  console.log(`Generated model ${id}`);
}

function writeWordsJsonFile(id: string, words: string[]): void {
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
      console.log("Added words:", "\x1b[32m", ...added.sort(), "\x1b[0m");
    }
    if (deleted.length > 0) {
      console.log("Deleted words:", "\x1b[31m", ...deleted.sort(), "\x1b[0m");
    }
  }
  writeWordsJson(id, words);
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

function writeCompressed(path: string, data: string): void {
  writeFileSync(`${path}.gz`, gzipSync(data, { level: 9 }));
}

function readWordsJson(id: string): string[] {
  try {
    return JSON.parse(readFileSync(wordsJsonPath(id)).toString("utf-8"));
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }

  return [];
}

function writeWordsJson(id: string, words: readonly string[]): void {
  writeFileSync(wordsJsonPath(id), JSON.stringify(words, null, 2));
}

function corpusPath(id: string): string {
  return resolve(__dirname, "corpus", `corpus-${id}.txt`);
}

function wordsPath(id: string): string {
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

function wordsJsonPath(id: string): string {
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
