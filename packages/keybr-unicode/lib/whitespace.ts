import { type CodePoint } from "./types.ts";

export const isControl = (codePoint: CodePoint): boolean => codePoint < 0x0020;

export const isLinebreak = (codePoint: CodePoint): boolean =>
  codePoint === /* Line Feed */ 0x000a ||
  codePoint === /* Line Tabulation */ 0x000b ||
  codePoint === /* Form Feed */ 0x000c ||
  codePoint === /* Carriage Return */ 0x000d ||
  codePoint === /* Next Line */ 0x0085 ||
  codePoint === /* Line Separator */ 0x2028 ||
  codePoint === /* Paragraph Separator */ 0x2029;

export const isWhitespace = (codePoint: CodePoint): boolean =>
  codePoint === /* Character Tabulation */ 0x0009 ||
  codePoint === /* Line Feed */ 0x000a ||
  codePoint === /* Line Tabulation */ 0x000b ||
  codePoint === /* Form Feed */ 0x000c ||
  codePoint === /* Carriage Return */ 0x000d ||
  codePoint === /* Space */ 0x0020 ||
  codePoint === /* Next Line */ 0x0085 ||
  codePoint === /* No-break Space */ 0x00a0 ||
  codePoint === /* En Quad */ 0x2000 ||
  codePoint === /* Em Quad */ 0x2001 ||
  codePoint === /* En Space */ 0x2002 ||
  codePoint === /* Em Space */ 0x2003 ||
  codePoint === /* Three-per-em Space */ 0x2004 ||
  codePoint === /* Four-per-em Space */ 0x2005 ||
  codePoint === /* Six-per-em Space */ 0x2006 ||
  codePoint === /* Figure Space */ 0x2007 ||
  codePoint === /* Punctuation Space */ 0x2008 ||
  codePoint === /* Thin Space */ 0x2009 ||
  codePoint === /* Hair Space */ 0x200a ||
  codePoint === /* Line Separator */ 0x2028 ||
  codePoint === /* Paragraph Separator */ 0x2029;
