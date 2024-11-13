import { readFileSync } from "node:fs";
import { type CharacterDict, KeyCharacters } from "@keybr/keyboard";
import {
  decodeText,
  parseCldr,
  parseKeymap,
  parseKlc,
  type ParseResult,
} from "@keybr/keyboard-io";
import chalk from "chalk";
import { pathTo } from "../root.ts";

export function importCldr(filename: string): CharacterDict {
  console.log(`Parsing CLDR file ${filename}`);
  return exec(parseCldr, filename);
}

export function importKeymap(filename: string): CharacterDict {
  console.log(`Parsing JSON file ${filename}`);
  return exec(parseKeymap, filename);
}

export function importKlc(filename: string): CharacterDict {
  console.log(`Parsing KLC file ${filename}`);
  return exec(parseKlc, filename);
}

function exec(parser: (text: string) => ParseResult, filename: string) {
  const text = decodeText(readFileSync(pathTo(filename)));
  const { layout, warnings } = parser(text);
  for (const warning of warnings) {
    console.error(chalk.red("WARNING: " + warning));
  }
  layout.set(new KeyCharacters("Space", 0x0020, null, null, null));
  return layout.dict();
}
