import { writeFileSync } from "node:fs";
import { basename } from "node:path";
import { type CodePointDict, getDiacritic } from "@keybr/keyboard";
import { type CodePoint } from "@keybr/unicode";
import { characterKeys } from "./keys.ts";
import { type LayoutConfig, toCodePointDict } from "./layout.ts";

export function writeGeneratedFile(
  layoutConfig: LayoutConfig,
  filename: string,
): void {
  const id = basename(filename, ".ts")
    .toUpperCase()
    .replaceAll("-", "_")
    .replaceAll(".", "_");
  const codePointDict = toCodePointDict(layoutConfig);
  const sourceFile = generateSourceFile(id, codePointDict);
  writeFileSync(filename, sourceFile, "utf-8");
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
    lines.push(`  ${keyId}: [${fields.join(", ")}],`);
  }
  lines.push("};");
  lines.push("");
  return lines.join("\n");
}

function formatCodePointName(codePoint: CodePoint): string {
  const diacritic = getDiacritic(codePoint);
  if (diacritic != null) {
    return `DEAD ${diacritic.name}`;
  } else {
    switch (codePoint) {
      case 0x0020:
        return "SPACE";
      case 0x00a0:
        return "NO-BREAK SPACE";
      case 0x202f:
        return "NARROW NO-BREAK SPACE";
      default:
        return String.fromCodePoint(codePoint);
    }
  }
}

function formatCodePointValue(codePoint: CodePoint): string {
  return "0x" + codePoint.toString(16).padStart(4, "0");
}
