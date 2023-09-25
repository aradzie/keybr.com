import { toCodePoints } from "@keybr/unicode";
import { attrNormal, type Char, type LineData } from "./types.ts";

export const charsAreEqual = (
  a: readonly Char[],
  b: readonly Char[],
): boolean => {
  if (a !== b) {
    const { length } = a;
    if (length !== b.length) {
      return false;
    }
    for (let i = 0; i < length; i++) {
      const x = a[i];
      const y = b[i];
      if (x !== y) {
        if (x.codePoint !== y.codePoint || x.attrs !== y.attrs) {
          return false;
        }
      }
    }
  }
  return true;
};

export const toChars = (text: string): readonly Char[] => {
  return [...toCodePoints(text)].map((codePoint) => ({
    codePoint,
    attrs: attrNormal,
  }));
};

export const singleLine = (chars: readonly Char[]): readonly LineData[] => {
  return [{ chars, key: "single" }];
};
