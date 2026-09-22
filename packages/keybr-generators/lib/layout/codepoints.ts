import { type CodePoint } from "@keybr/unicode";
import names from "@unicode/unicode-17.0.0/Names/index.mjs";

export function formatCodePointName(codePoint: CodePoint): string {
  return names.get(codePoint) ?? String.fromCodePoint(codePoint);
}

export function formatCodePointValue(codePoint: CodePoint): string {
  return "0x" + codePoint.toString(16).padStart(4, "0");
}
