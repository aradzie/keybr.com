import { writeFileSync } from "node:fs";
import { basename } from "node:path";
import {
  type Character,
  type CharacterDict,
  KeyCharacters,
  type KeyId,
} from "@keybr/keyboard";
import { formatCodePointName, formatCodePointValue } from "./codepoints.ts";

export function writeGeneratedFile(
  layout: CharacterDict,
  filename: string,
): void {
  const id = basename(filename, ".ts")
    .toUpperCase()
    .replaceAll("-", "_")
    .replaceAll(".", "_");
  const sourceFile = generateSourceFile(id, layout);
  writeFileSync(filename, sourceFile);
}

export function generateSourceFile(id: string, layout: CharacterDict): string {
  const lines: string[] = [];
  lines.push("// Generated file, do not edit.");
  lines.push("");
  lines.push('import { type CharacterDict } from "../types.ts";');
  lines.push("");
  lines.push("// prettier-ignore");
  lines.push(`export const LAYOUT_${id}: CharacterDict = {`);
  for (const [key, characters] of Object.entries(layout) as [
    KeyId,
    Character[],
  ][]) {
    while (characters.length > 0 && characters.at(-1) == null) {
      characters.pop();
    }
    if (characters.length > 0) {
      const fields = characters.map((character) => {
        if (KeyCharacters.isCodePoint(character)) {
          const name = formatCodePointName(character);
          const value = formatCodePointValue(character);
          return `/* ${name} */ ${value}`;
        }
        if (KeyCharacters.isDead(character)) {
          const name = formatCodePointName(character.dead);
          const value = formatCodePointValue(character.dead);
          return `{ dead: /* ${name} */ ${value} }`;
        }
        if (KeyCharacters.isSpecial(character)) {
          const name = formatCodePointName(character.special);
          const value = formatCodePointValue(character.special);
          return `{ special: /* ${name} */ ${value} }`;
        }
        if (KeyCharacters.isLigature(character)) {
          return `{ ligature: "${character.ligature}" }`;
        }
        return `null`;
      });
      lines.push(`  ${key}: [${fields.join(", ")}],`);
    }
  }
  lines.push("};");
  lines.push("");
  return lines.join("\n");
}
