import { getDiacritic } from "@keybr/keyboard";
import type { CodePoint } from "@keybr/unicode";

export function formatCodePointName(codePoint: CodePoint): string {
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

export function formatCodePointValue(codePoint: CodePoint): string {
  return "0x" + codePoint.toString(16).padStart(4, "0");
}
