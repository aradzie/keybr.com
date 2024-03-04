/**
 * Maps printable characters to combining diacritical marks.
 */
export const diacritics = new Map([
  [/* ` */ 0x0060, /* COMBINING GRAVE ACCENT */ 0x0300],
  [/* ´ */ 0x00b4, /* COMBINING ACUTE ACCENT */ 0x0301],
  [/* ^ */ 0x005e, /* COMBINING CIRCUMFLEX ACCENT */ 0x0302],
  [/* ~ */ 0x007e, /* COMBINING TILDE */ 0x0303],
  [/* ¯ */ 0x00af, /* COMBINING MACRON */ 0x0304],
  [/* ˘ */ 0x02d8, /* COMBINING BREVE */ 0x0306],
  [/* ˙ */ 0x02d9, /* COMBINING DOT ABOVE */ 0x0307],
  [/* ¨ */ 0x00a8, /* COMBINING DIAERESIS */ 0x0308],
  [/* ° */ 0x00b0, /* COMBINING RING ABOVE */ 0x030a],
  [/* ˝ */ 0x02dd, /* COMBINING DOUBLE ACUTE */ 0x030b],
  [/* ˇ */ 0x02c7, /* COMBINING CARON */ 0x030c],
  [/* ˎ */ 0x02ce, /* COMBINING GRAVE ACCENT BELOW */ 0x0316],
  [/* ˏ */ 0x02cf, /* COMBINING ACUTE ACCENT BELOW */ 0x0317],
  [/* ¸ */ 0x00b8, /* COMBINING CEDILLA */ 0x0327],
  [/* ˛ */ 0x02db, /* COMBINING OGONEK */ 0x0328],
  [/* GREEK TONOS */ 0x0384, /* COMBINING ACUTE ACCENT */ 0x0301],
  [/* GREEK DIALYTIKA TONOS */ 0x0385, /* COMBINING DIAERESIS */ 0x0308], // TODO a sequence
]);

// U+0384 "΄" GREEK TONOS -> U+0301 COMBINING ACUTE ACCENT
// U+0385 "΅" GREEK DIALYTIKA TONOS -> U+0308 COMBINING DIAERESIS U+0301 COMBINING ACUTE ACCENT
