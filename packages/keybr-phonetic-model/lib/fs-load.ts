import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { type Language } from "@keybr/keyboard";
import { makePhoneticModel, type PhoneticModel } from "./index.ts";
import { TransitionTable } from "./transitiontable.ts";

export function getPath(language: Language): string {
  return resolve(__dirname, `..`, `assets`, `model-${language}.data`);
}

export async function loadModel(language: Language): Promise<{
  table: TransitionTable;
  model: PhoneticModel;
}> {
  const path = getPath(language);
  const data = await readFile(path);
  const table = TransitionTable.load(data);
  const model = makePhoneticModel(language, table);
  return { table, model };
}

export function loadModelSync(language: Language): {
  table: TransitionTable;
  model: PhoneticModel;
} {
  const path = getPath(language);
  const data = readFileSync(path);
  const table = TransitionTable.load(data);
  const model = makePhoneticModel(language, table);
  return { table, model };
}
