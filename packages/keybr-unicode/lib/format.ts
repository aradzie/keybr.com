import { type CodePoint } from "./types.ts";

export function formatCodePoint(codePoint: CodePoint): string {
  return "U+" + codePoint.toString(16).padStart(4, "0");
}
