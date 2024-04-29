import { getDiacritic } from "@keybr/keyboard";
import { type CodePoint } from "@keybr/unicode";

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
      case 0x200c:
        return "ZERO WIDTH NON-JOINER";
      case 0x200d:
        return "ZERO WIDTH JOINER";
      case 0x200e:
        return "LEFT-TO-RIGHT MARK";
      case 0x200f:
        return "RIGHT-TO-LEFT MARK";
      case 0x202f:
        return "NARROW NO-BREAK SPACE";
      case 0x034f:
        return "COMBINING GRAPHEME JOINER";
      default:
        return String.fromCodePoint(codePoint);
    }
  }
}

export function formatCodePointValue(codePoint: CodePoint): string {
  return "0x" + codePoint.toString(16).padStart(4, "0");
}
