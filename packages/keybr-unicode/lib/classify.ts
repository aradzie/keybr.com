import categoryZl from "@unicode/unicode-14.0.0/General_Category/Line_Separator/code-points.js";
import categoryLl from "@unicode/unicode-14.0.0/General_Category/Lowercase_Letter/code-points.js";
import categoryNd from "@unicode/unicode-14.0.0/General_Category/Number/code-points.js";
import categoryZp from "@unicode/unicode-14.0.0/General_Category/Paragraph_Separator/code-points.js";
import categoryZs from "@unicode/unicode-14.0.0/General_Category/Space_Separator/code-points.js";
import categoryLu from "@unicode/unicode-14.0.0/General_Category/Uppercase_Letter/code-points.js";
import { type CodePoint } from "./types.ts";

const bmWhitespace = 1;
const bmLinebreak = 2;
const bmDigit = 4;
const bmLcLetter = 8;
const bmUcLetter = 16;
const bmLetter = 32;

const charMap = (() => {
  const map = new Uint8Array(0x01_0000); // Only BMP.
  for (const codePoint of categoryZs) {
    map[codePoint] |= bmWhitespace;
  }
  for (const codePoint of categoryZl) {
    map[codePoint] |= bmWhitespace | bmLinebreak;
  }
  for (const codePoint of categoryZp) {
    map[codePoint] |= bmWhitespace | bmLinebreak;
  }
  for (const codePoint of categoryNd) {
    map[codePoint] |= bmDigit;
  }
  for (const codePoint of categoryLl) {
    map[codePoint] = bmLcLetter | bmLetter;
  }
  for (const codePoint of categoryLu) {
    map[codePoint] = bmUcLetter | bmLetter;
  }
  return map;
})();

export const isControl = (codePoint: CodePoint): boolean => codePoint < 0x0020;

export const isLinebreak = (codePoint: CodePoint): boolean =>
  codePoint === 0x000a || // line feed
  codePoint === 0x000b || // line tabulation
  codePoint === 0x000c || // form feed
  codePoint === 0x000d || // carriage return
  codePoint === 0x0085 || // next line
  codePoint === 0x2028 || // line separator
  codePoint === 0x2029; // paragraph separator

export const isWhitespace = (codePoint: CodePoint): boolean =>
  codePoint === 0x0009 || // character tabulation
  codePoint === 0x000a || // line feed
  codePoint === 0x000b || // line tabulation
  codePoint === 0x000c || // form feed
  codePoint === 0x000d || // carriage return
  codePoint === 0x0020 || // space
  codePoint === 0x0085 || // next line
  codePoint === 0x00a0 || // no-break space
  codePoint === 0x2000 || // en quad
  codePoint === 0x2001 || // em quad
  codePoint === 0x2002 || // en space
  codePoint === 0x2003 || // em space
  codePoint === 0x2004 || // three-per-em space
  codePoint === 0x2005 || // four-per-em space
  codePoint === 0x2006 || // six-per-em space
  codePoint === 0x2007 || // figure space
  codePoint === 0x2008 || // punctuation space
  codePoint === 0x2009 || // thin space
  codePoint === 0x200a || // hair space
  codePoint === 0x2028 || // line separator
  codePoint === 0x2029; // paragraph separator

export const isDigit = (codePoint: CodePoint): boolean =>
  (charMap[codePoint] & bmDigit) === bmDigit;

export const isLetter = (codePoint: CodePoint): boolean =>
  (charMap[codePoint] & bmLetter) === bmLetter;

export const isLcLetter = (codePoint: CodePoint): boolean =>
  (charMap[codePoint] & bmLcLetter) === bmLcLetter;

export const isUcLetter = (codePoint: CodePoint): boolean =>
  (charMap[codePoint] & bmUcLetter) === bmUcLetter;

export const isWordJoiner = (codePoint: CodePoint): boolean =>
  codePoint === 0x0027 || // apostrophe
  codePoint === 0x002d || // hyphen-minus
  codePoint === 0x2010 || // hyphen
  codePoint === 0x2011 || // non-breaking hyphen
  codePoint === 0x2012 || // figure dash
  codePoint === 0x2013 || // en dash
  codePoint === 0x2014 || // em dash
  codePoint === 0x2019; // right single quotation mark
