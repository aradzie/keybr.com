import { writeFileSync } from "node:fs";
import { basename } from "node:path";
import { type CharacterDict, KeyCharacters } from "@keybr/keyboard";
import { formatCodePointName, formatCodePointValue } from "./codepoints.ts";
import { characterKeys } from "./keys.ts";

export function writeGeneratedFile(
  dict: CharacterDict,
  filename: string,
): void {
  const id = basename(filename, ".ts")
    .toUpperCase()
    .replaceAll("-", "_")
    .replaceAll(".", "_");
  const sourceFile = generateSourceFile(id, dict);
  writeFileSync(filename, sourceFile);
}

export function generateSourceFile(id: string, dict: CharacterDict): string {
  const lines: string[] = [];
  lines.push("// Generated file, do not edit.");
  lines.push("");
  lines.push('import { type CharacterDict } from "../types.ts";');
  lines.push("");
  lines.push("// prettier-ignore");
  lines.push(`export const LAYOUT_${id}: CharacterDict = {`);
  for (const keyId of characterKeys) {
    const characters = [...(dict[keyId] ?? [])];
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
      lines.push(`  ${keyId}: [${fields.join(", ")}],`);
    }
  }
  lines.push("};");
  lines.push("");
  return lines.join("\n");
}
