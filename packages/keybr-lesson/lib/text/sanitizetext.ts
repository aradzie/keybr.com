import {
  type CodePoint,
  type CodePointSet,
  isControl,
  isDiacritic,
  isLinebreak,
  isWhitespace,
  stripDiacritic,
  toCodePoints,
} from "@keybr/unicode";

/**
 * Removes any illegal characters from the specified text, collapses whitespace.
 * @param text A string to sanitize.
 * @param include A set of whitelisted code points.
 * @param exclude A set of blacklisted code points.
 * @return A sanitized string.
 */
export function sanitizeText(
  text: string,
  include: CodePointSet | null = null,
  exclude: CodePointSet | null = null,
): string {
  let result = "";
  let ws = "";

  const append = (
    codePoint: CodePoint,
    s = String.fromCodePoint(codePoint),
  ) => {
    if (exclude != null && exclude.has(codePoint)) {
      return false;
    }
    if (include == null || include.has(codePoint)) {
      if (ws !== "") {
        result += ws;
        ws = "";
      }
      result += s;
      return true;
    }
    return false;
  };

  for (let codePoint of toCodePoints(text.normalize())) {
    if (isLinebreak(codePoint)) {
      if (result !== "") {
        ws = "\n";
      }
      continue;
    }
    if (isWhitespace(codePoint)) {
      if (result !== "" && ws !== "\n") {
        ws = " ";
      }
      continue;
    }
    if (isControl(codePoint)) {
      continue;
    }
    if (isDiacritic(codePoint)) {
      continue;
    }
    switch (codePoint) {
      case 0x2012: // figure dash ‒
      case 0x2013: // en dash –
      case 0x2014: // em dash —
      case 0x2015: // horizontal bar ―
        append(/* - */ 0x002d);
        continue;
      case 0x2018: // german right single quote ‘
      case 0x2019: // secondary level quotation ’
      case 0x201a: // german left single quote ‚
        append(/* ' */ 0x0027);
        continue;
      case 0x201c: // german right double quote “
      case 0x201d: // primary level quotation ”
      case 0x201e: // german left double quote „
      case 0x00ab: // «
      case 0x00bb: // »
        append(/* " */ 0x0022);
        continue;
      case 0x2026: // horizontal ellipsis …
        append(/* . */ 0x002e, "...");
        continue;
    }
    if (!append(codePoint)) {
      const baseCodePoint = stripDiacritic(codePoint);
      if (baseCodePoint !== codePoint) {
        append(baseCodePoint);
      }
    }
  }
  return result;
}
