import { type Character } from "@keybr/keyboard";
import { type CodePoint } from "@keybr/unicode";
import chalk from "chalk";
import { formatCodePointValue } from "./codepoints.ts";

/**
 * Maps printable characters to combining diacritical marks.
 */
const diacritics = new Map([
  [/* ` */ 0x0060, { dead: /* COMBINING GRAVE ACCENT */ 0x0300 }],
  [/* ´ */ 0x00b4, { dead: /* COMBINING ACUTE ACCENT */ 0x0301 }],
  [/* ^ */ 0x005e, { dead: /* COMBINING CIRCUMFLEX ACCENT */ 0x0302 }],
  [/* ~ */ 0x007e, { dead: /* COMBINING TILDE */ 0x0303 }],
  [/* ¯ */ 0x00af, { dead: /* COMBINING MACRON */ 0x0304 }],
  [/* ˘ */ 0x02d8, { dead: /* COMBINING BREVE */ 0x0306 }],
  [/* ˙ */ 0x02d9, { dead: /* COMBINING DOT ABOVE */ 0x0307 }],
  [/* ¨ */ 0x00a8, { dead: /* COMBINING DIAERESIS */ 0x0308 }],
  [/* ° */ 0x00b0, { dead: /* COMBINING RING ABOVE */ 0x030a }],
  [/* ˝ */ 0x02dd, { dead: /* COMBINING DOUBLE ACUTE */ 0x030b }],
  [/* ˇ */ 0x02c7, { dead: /* COMBINING CARON */ 0x030c }],
  [/* ˎ */ 0x02ce, { dead: /* COMBINING GRAVE ACCENT BELOW */ 0x0316 }],
  [/* ˏ */ 0x02cf, { dead: /* COMBINING ACUTE ACCENT BELOW */ 0x0317 }],
  [/* ¸ */ 0x00b8, { dead: /* COMBINING CEDILLA */ 0x0327 }],
  [/* ˛ */ 0x02db, { dead: /* COMBINING OGONEK */ 0x0328 }],
  [/* GREEK TONOS */ 0x0384, { dead: /* COMBINING ACUTE ACCENT */ 0x0301 }],
  // [/* GREEK DIALYTIKA TONOS */ 0x0385, { dead: [/* COMBINING DIAERESIS */ 0x0308, /* COMBINING ACUTE ACCENT */ 0x0301] }],
]);

export const makeDeadCharacter = (
  keyId: string,
  codePoint: CodePoint,
): Character | null => {
  const dead = diacritics.get(codePoint);
  if (dead != null) {
    return dead;
  }
  if (codePoint === /* * */ 0x002a) {
    return { dead: codePoint };
  }
  console.error(
    chalk.red(
      `[${keyId}] Invalid dead character ${formatCodePointValue(codePoint)}`,
    ),
  );
  return null;
};
