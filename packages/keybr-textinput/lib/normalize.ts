import { type CodePoint, isWhitespace } from "@keybr/unicode";

export function normalize(codePoint: CodePoint): CodePoint {
  if (isWhitespace(codePoint)) {
    return 0x0020; // Space
  }
  switch (codePoint) {
    case 0x002d: // Hyphen-Minus
    case 0x2010: // Hyphen
    case 0x2011: // Non-Breaking Hyphen
    case 0x2012: // Figure Dash
    case 0x2013: // En Dash
    case 0x2014: // Em Dash
      return 0x002d; // Hyphen-Minus
    case 0x0022: // Quotation Mark
    case 0x00ab: // Left-Pointing Double Angle Quotation Mark
    case 0x00bb: // Right-Pointing Double Angle Quotation Mark
    case 0x201c: // Left Double Quotation Mark
    case 0x201d: // Right Double Quotation Mark
    case 0x201e: // Double Low-9 Quotation Mark
    case 0x201f: // Double High-Reversed-9 Quotation Mark
    case 0x2039: // Single Left-Pointing Angle Quotation Mark
    case 0x203a: // Single Right-Pointing Angle Quotation Mark
      return 0x0022; // Quotation Mark
    case 0x0027: // Apostrophe
    case 0x2018: // Left Single Quotation Mark
    case 0x2019: // Right Single Quotation Mark
      return 0x0027; // Apostrophe
  }
  return codePoint;
}

export function normalizeWhitespace(codePoint: CodePoint): CodePoint {
  if (isWhitespace(codePoint)) {
    return 0x0020; // Space
  }
  return codePoint;
}
