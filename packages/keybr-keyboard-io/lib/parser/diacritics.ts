import { type Character } from "@keybr/keyboard";
import { type CodePoint, formatCodePoint } from "@keybr/unicode";
import { type ParseResult } from "./types.ts";

export const diacritics = new Map([
  [/* GRAVE ACCENT */ 0x0060, /* COMBINING GRAVE ACCENT */ 0x0300],
  [/* ACUTE ACCENT */ 0x00b4, /* COMBINING ACUTE ACCENT */ 0x0301],
  [/* CIRCUMFLEX ACCENT */ 0x005e, /* COMBINING CIRCUMFLEX ACCENT */ 0x0302],
  [/* TILDE */ 0x007e, /* COMBINING TILDE */ 0x0303],
  [/* MACRON */ 0x00af, /* COMBINING MACRON */ 0x0304],
  [/* BREVE */ 0x02d8, /* COMBINING BREVE */ 0x0306],
  [/* DOT ABOVE */ 0x02d9, /* COMBINING DOT ABOVE */ 0x0307],
  [/* DIAERESIS */ 0x00a8, /* COMBINING DIAERESIS */ 0x0308],
  [/* DEGREE SIGN */ 0x00b0, /* COMBINING RING ABOVE */ 0x030a],
  [/* DOUBLE ACUTE ACCENT */ 0x02dd, /* COMBINING DOUBLE ACUTE ACCENT */ 0x030b],
  [/* CARON */ 0x02c7, /* COMBINING CARON */ 0x030c],
  [/* MODIFIER LETTER LOW GRAVE ACCENT */ 0x02ce, /* COMBINING GRAVE ACCENT BELOW */ 0x0316],
  [/* MODIFIER LETTER LOW ACUTE ACCENT */ 0x02cf, /* COMBINING ACUTE ACCENT BELOW */ 0x0317],
  [/* CEDILLA */ 0x00b8, /* COMBINING CEDILLA */ 0x0327],
  [/* OGONEK */ 0x02db, /* COMBINING OGONEK */ 0x0328],
  [/* GREEK TONOS */ 0x0384, /* COMBINING ACUTE ACCENT */ 0x0301],
]);

export const makeDeadCharacter = (result: ParseResult, key: string, codePoint: CodePoint): Character | null => {
  if (codePoint === /* "*" */ 0x002a) {
    return { dead: codePoint };
  }
  const dead = diacritics.get(codePoint);
  if (dead != null) {
    return { dead };
  }
  result.warnings.push(`[${key}] Invalid dead character: ${formatCodePoint(codePoint)}`);
  return null;
};
