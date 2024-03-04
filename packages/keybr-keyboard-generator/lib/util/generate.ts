import { writeFileSync } from "node:fs";
import { basename } from "node:path";
import { type CodePointDict } from "@keybr/keyboard";
import { formatCodePointName, formatCodePointValue } from "./codepoints.ts";
import { characterKeys } from "./keys.ts";
import { type KeyMap, toCodePointDict } from "./layout.ts";

export function writeGeneratedFile(keymap: KeyMap, filename: string): void {
  const id = basename(filename, ".ts")
    .toUpperCase()
    .replaceAll("-", "_")
    .replaceAll(".", "_");
  const codePointDict = toCodePointDict(keymap);
  const sourceFile = generateSourceFile(id, codePointDict);
  writeFileSync(filename, sourceFile);
}

function generateSourceFile(id: string, dict: CodePointDict): string {
  const lines: string[] = [];
  lines.push("// Generated file, do not edit.");
  lines.push("");
  lines.push('import { type CodePointDict } from "../../types.ts";');
  lines.push("");
  lines.push("// prettier-ignore");
  lines.push(`export const LAYOUT_${id}: CodePointDict = {`);
  for (const keyId of characterKeys) {
    const codePoints = dict[keyId];
    const fields = codePoints.map((codePoint) => {
      if (codePoint) {
        const name = formatCodePointName(codePoint);
        const value = formatCodePointValue(codePoint);
        return `/* ${name} */ ${value}`;
      } else {
        return null;
      }
    });
    if (fields.length > 0) {
      lines.push(`  ${keyId}: [${fields.join(", ")}],`);
    }
  }
  lines.push("};");
  lines.push("");
  return lines.join("\n");
}
