#!/usr/bin/env -S node -r @keybr/tsl

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { gunzipSync, gzipSync } from "node:zlib";
import { type CodePoint } from "@keybr/unicode";
import { TransitionTableBuilder } from "./builder.ts";
import { languages } from "./languages.ts";
import { findWords, fromCsv, toCsv } from "./words.ts";

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
    const builder = new TransitionTableBuilder(4, [0x0020, ...alphabet]);
    for (const [word, count] of fromCsv(data)) {
      if (word.length >= 3) {
        for (let i = 0; i < count; i++) {
          builder.append(word);
        }
      }
    }
    writeFileSync(dataPath(id), builder.build().compress());
    console.log(`Generated model ${id}`);
  }
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

function corpusPath(id: string): string {
  return resolve(__dirname, "corpus", `${id}-corpus.txt`);
}

function wordsPath(id: string): string {
  return resolve(__dirname, "corpus", `${id}-words.csv`);
}

function dataPath(id: string): string {
  return resolve(__dirname, "..", "..", "assets", `lang-${id}.data`);
}
