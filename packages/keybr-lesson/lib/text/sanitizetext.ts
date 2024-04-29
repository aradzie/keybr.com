import {
  type CodePointSet,
  isControl,
  isLinebreak,
  isWhitespace,
  toCodePoints,
} from "@keybr/unicode";

/**
 * Removes any illegal characters from the specified text.
 * @param text A string to sanitize.
 * @param include A set of white-listed code points.
 * @param exclude A set of black-listed code points.
 * @return The sanitized string.
 */
export function sanitizeText(
  text: string,
  include?: CodePointSet | null,
  exclude?: CodePointSet | null,
): string {
  let result = "";
  let next = "";
  for (let codePoint of toCodePoints(text.normalize())) {
    if (isLinebreak(codePoint)) {
      if (result === "") {
        next = "";
      } else {
        next = "\n";
      }
      continue;
    }
    if (isControl(codePoint) || isWhitespace(codePoint)) {
      if (result === "") {
        next = "";
      } else if (next !== "\n") {
        next = " ";
      }
      continue;
    }
    result += next;
    next = "";
    let s = "";
    switch (codePoint) {
      case 0x2012: // figure dash ‒
      case 0x2013: // en dash –
      case 0x2014: // em dash —
      case 0x2015: // horizontal bar ―
        codePoint = 0x002d;
        s = "-";
        break;
      case 0x2018: // german right single quote ‘
      case 0x2019: // secondary level quotation ’
      case 0x201a: // german left single quote ‚
        codePoint = 0x0027;
        s = "'";
        break;
      case 0x201c: // german right double quote “
      case 0x201d: // primary level quotation ”
      case 0x201e: // german left double quote „
      case 0x00ab: // «
      case 0x00bb: // »
        codePoint = 0x0022;
        s = '"';
        break;
      case 0x2026: // horizontal ellipsis …
        codePoint = 0x002e;
        s = "...";
        break;
      default:
        s = String.fromCodePoint(codePoint);
    }
    if (exclude != null && exclude.has(codePoint)) {
      continue;
    }
    if (include == null || include.has(codePoint)) {
      result += s;
    }
  }
  return result;
}
