import { type CodePoint } from "./types.ts";

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
