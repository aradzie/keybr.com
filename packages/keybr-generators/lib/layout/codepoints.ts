import { type CodePoint } from "@keybr/unicode";

const codePointNames = new Map([
  [0x0020, "SPACE"],
  [0x00a0, "NO-BREAK SPACE"],
  [0x00ad, "SOFT HYPHEN"],
  [0x0300, "COMBINING GRAVE ACCENT"],
  [0x0301, "COMBINING ACUTE ACCENT"],
  [0x0302, "COMBINING CIRCUMFLEX ACCENT"],
  [0x0303, "COMBINING TILDE"],
  [0x0304, "COMBINING MACRON"],
  [0x0305, "COMBINING OVERLINE"],
  [0x0306, "COMBINING BREVE"],
  [0x0307, "COMBINING DOT ABOVE"],
  [0x0308, "COMBINING DIAERESIS"],
  [0x0309, "COMBINING HOOK ABOVE"],
  [0x030a, "COMBINING RING ABOVE"],
  [0x030b, "COMBINING DOUBLE ACUTE"],
  [0x030c, "COMBINING CARON"],
  [0x030d, "COMBINING VERTICAL LINE ABOVE"],
  [0x030e, "COMBINING DOUBLE VERTICAL LINE ABOVE"],
  [0x030f, "COMBINING DOUBLE GRAVE ACCENT"],
  [0x0327, "COMBINING CEDILLA"],
  [0x0328, "COMBINING OGONEK"],
  [0x034f, "COMBINING GRAPHEME JOINER"],
  [0x0384, "GREEK TONOS"],
  [0x0385, "GREEK DIALYTIKA TONOS"],
  [0x200c, "ZERO WIDTH NON-JOINER"],
  [0x200d, "ZERO WIDTH JOINER"],
  [0x200e, "LEFT-TO-RIGHT MARK"],
  [0x200f, "RIGHT-TO-LEFT MARK"],
  [0x202f, "NARROW NO-BREAK SPACE"],
]);

export function formatCodePointName(codePoint: CodePoint): string {
  return codePointNames.get(codePoint) ?? String.fromCodePoint(codePoint);
}

export function formatCodePointValue(codePoint: CodePoint): string {
  return "0x" + codePoint.toString(16).padStart(4, "0");
}
