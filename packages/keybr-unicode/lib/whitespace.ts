import { type CodePoint } from "./types.ts";

export const isControl = (codePoint: CodePoint): boolean => codePoint < 0x0020;

export const isLinebreak = (codePoint: CodePoint): boolean =>
  codePoint === /* LINE FEED */ 0x000a ||
  codePoint === /* LINE TABULATION */ 0x000b ||
  codePoint === /* FORM FEED */ 0x000c ||
  codePoint === /* CARRIAGE RETURN */ 0x000d ||
  codePoint === /* LINE SEPARATOR */ 0x2028 ||
  codePoint === /* PARAGRAPH SEPARATOR */ 0x2029;

export const isWhitespace = (codePoint: CodePoint): boolean =>
  codePoint === /* CHARACTER TABULATION */ 0x0009 ||
  codePoint === /* LINE FEED */ 0x000a ||
  codePoint === /* LINE TABULATION */ 0x000b ||
  codePoint === /* FORM FEED */ 0x000c ||
  codePoint === /* CARRIAGE RETURN */ 0x000d ||
  codePoint === /* SPACE */ 0x0020 ||
  codePoint === /* NO-BREAK SPACE */ 0x00a0 ||
  codePoint === /* EN QUAD */ 0x2000 ||
  codePoint === /* EM QUAD */ 0x2001 ||
  codePoint === /* EN SPACE */ 0x2002 ||
  codePoint === /* EM SPACE */ 0x2003 ||
  codePoint === /* THREE-PER-EM SPACE */ 0x2004 ||
  codePoint === /* FOUR-PER-EM SPACE */ 0x2005 ||
  codePoint === /* SIX-PER-EM SPACE */ 0x2006 ||
  codePoint === /* FIGURE SPACE */ 0x2007 ||
  codePoint === /* PUNCTUATION SPACE */ 0x2008 ||
  codePoint === /* THIN SPACE */ 0x2009 ||
  codePoint === /* HAIR SPACE */ 0x200a ||
  codePoint === /* LINE SEPARATOR */ 0x2028 ||
  codePoint === /* PARAGRAPH SEPARATOR */ 0x2029;
