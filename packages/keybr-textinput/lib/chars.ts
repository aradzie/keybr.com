import { type CodePoint, toCodePoints } from "@keybr/unicode";

export type StyledText = string | StyledTextSpan | readonly StyledText[];

export type StyledTextSpan = { readonly text: string; readonly cls: string };

export const enum Attr {
  Normal = 0,
  Hit = 1,
  Miss = 2,
  Garbage = 4,
  Cursor = 8,
}

export type Char = {
  readonly codePoint: CodePoint;
  readonly attrs: number;
  readonly cls?: string | null;
};

export type Line = {
  readonly text: string;
  readonly chars: readonly Char[];
};

export type LineList<T extends Line = Line> = {
  readonly text: string;
  readonly lines: readonly T[];
};

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

export function splitStyledText(
  text: StyledText,
  attrs: Attr = Attr.Normal,
): Char[] {
  const list: Array<Char> = [];
  if (Array.isArray(text)) {
    for (const item of text) {
      list.push(...splitStyledText(item));
    }
  } else if (typeof text === "string") {
    list.push(
      ...[...toCodePoints(text)].map((codePoint) => ({
        codePoint,
        cls: null,
        attrs,
      })),
    );
  } else if (isStyledTextSpan(text)) {
    list.push(
      ...[...toCodePoints(text.text)].map((codePoint) => ({
        codePoint,
        cls: text.cls,
        attrs,
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

export function toLine(styledText: StyledText): Line {
  const text = flattenStyledText(styledText);
  const chars = splitStyledText(styledText);
  return { text, chars };
}

export function singleLine(styledText: StyledText): LineList {
  const text = flattenStyledText(styledText);
  const chars = splitStyledText(styledText);
  return { text, lines: [{ text, chars }] };
}
