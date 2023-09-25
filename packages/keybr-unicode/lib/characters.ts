import { type CharCode, type CodePoint } from "./types.ts";

export const isCharCode = (value: number): boolean =>
  Number.isSafeInteger(value) && value >= 0 && value < 0x01_0000;

export const isHighSurrogate = (charCode: CharCode): boolean =>
  charCode >= 0xd800 && charCode < 0xdc00;

export const isLowSurrogate = (charCode: CharCode): boolean =>
  charCode >= 0xdc00 && charCode < 0xe000;

export const isSurrogate = (charCode: CharCode): boolean =>
  charCode >= 0xd800 && charCode < 0xe000;

export const isSurrogatePair = (
  charCode0: CharCode,
  charCode1: CharCode,
): boolean => isHighSurrogate(charCode0) && isLowSurrogate(charCode1);

export const toCodePoint = (
  highSurrogate: CharCode,
  lowSurrogate: CharCode,
): CodePoint =>
  ((highSurrogate - 0xd800) << 10) + (lowSurrogate - 0xdc00) + 0x01_0000;

export const toHighSurrogate = (codePoint: CodePoint): CharCode =>
  ((codePoint - 0x01_0000) >> 10) + 0xd800;

export const toLowSurrogate = (codePoint: CodePoint): CharCode =>
  ((codePoint - 0x01_0000) & 0x03ff) + 0xdc00;
