import unicodeNames from "@unicode/unicode-16.0.0/Names/index.js";

const controlNames = new Map([
  [0x0000, "NULL"],
  [0x0008, "BACKSPACE"],
  [0x0009, "CHARACTER TABULATION"],
  [0x000a, "LINE FEED"],
  [0x000b, "LINE TABULATION"],
  [0x000c, "FORM FEED"],
  [0x000d, "CARRIAGE RETURN"],
  [0x001b, "ESCAPE"],
]);

export function getCodePointName(codePoint) {
  return controlNames.get(codePoint) ?? unicodeNames.get(codePoint) ?? "?";
}
