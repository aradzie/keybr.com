import { toCodePoints } from "@keybr/unicode";
import {
  Attr,
  type Char,
  type Line,
  type LineList,
  type StyledText,
  type StyledTextItem,
  type StyledTextSpan,
} from "./types.ts";

export function flattenStyledText(text: StyledText): string {
  const list: Array<string> = [];
  if (Array.isArray(text)) {
    for (const item of text) {
      list.push(flattenStyledText(item));
    }
  } else if (typeof text === "string") {
    list.push(text);
  } else if (isStyledTextSpan(text)) {
    list.push(text.text);
  } else {
    throw new TypeError();
  }
  return list.join("");
}

export function splitStyledText(text: StyledText): StyledTextItem[] {
  const list: Array<StyledTextItem> = [];
  if (Array.isArray(text)) {
    for (const item of text) {
      list.push(...splitStyledText(item));
    }
  } else if (typeof text === "string") {
    list.push(
      ...[...toCodePoints(text)].map((codePoint) => ({
        codePoint,
        cls: null,
      })),
    );
  } else if (isStyledTextSpan(text)) {
    list.push(
      ...[...toCodePoints(text.text)].map((codePoint) => ({
        codePoint,
        cls: text.cls,
      })),
    );
  } else {
    throw new TypeError();
  }
  return list;
}

export function isStyledTextSpan(v: unknown): v is StyledTextSpan {
  return v != null && typeof v === "object" && "text" in v;
}

export function toChar(
  { codePoint, cls }: StyledTextItem,
  attrs: number,
): Char {
  return { codePoint, attrs, cls };
}

export function charsAreEqual(a: Char, b: Char): boolean {
  if (a !== b) {
    if (a.codePoint !== b.codePoint) {
      return false;
    }
    if (a.attrs !== b.attrs) {
      return false;
    }
    if (a.cls !== b.cls) {
      return false;
    }
  }
  return true;
}

export function charArraysAreEqual(
  a: readonly Char[],
  b: readonly Char[],
): boolean {
  if (a !== b) {
    const { length } = a;
    if (length !== b.length) {
      return false;
    }
    for (let i = 0; i < length; i++) {
      const x = a[i];
      const y = b[i];
      if (!charsAreEqual(x, y)) {
        return false;
      }
    }
  }
  return true;
}

export function toChars(text: StyledText): readonly Char[] {
  return splitStyledText(text).map((item) => toChar(item, Attr.Normal));
}

export function toLine(styledText: StyledText): Line {
  const text = flattenStyledText(styledText);
  return { text, chars: toChars(styledText) };
}

export function singleLine(styledText: StyledText): LineList {
  const text = flattenStyledText(styledText);
  return { text, lines: [{ text, chars: toChars(styledText) }] };
}
