import { Attr, CaretShapeStyle } from "@keybr/textinput";
import { type CSSProperties } from "react";

const cursorStyles = {
  block: {
    color: "var(--textinput-cursor__color)",
    backgroundColor: "var(--textinput-cursor__background-color)",
  } satisfies CSSProperties,
  box: {
    borderStyle: "solid",
    borderColor: "var(--textinput-cursor__background-color)",
  } satisfies CSSProperties,
  line: {
    backgroundColor: "var(--textinput-cursor__background-color)",
  } satisfies CSSProperties,
  underline: {
    backgroundColor: "var(--textinput-cursor__background-color)",
  } satisfies CSSProperties,
} as const;

export const textItemStyle = {
  display: "inline-block",
  whiteSpace: "nowrap",
} satisfies CSSProperties;

const textStyles = {
  normal: {
    color: "var(--textinput__color)",
  } satisfies CSSProperties,
  special: {
    color: "var(--textinput--special__color)",
  } satisfies CSSProperties,
  hit: {
    color: "var(--textinput--hit__color)",
  } satisfies CSSProperties,
  miss: {
    color: "var(--textinput--miss__color)",
  } satisfies CSSProperties,
  garbage: {
    color: "var(--textinput__color)",
    backgroundColor: "var(--textinput--miss__color)",
  } satisfies CSSProperties,
} as const;

const syntaxStyles = {
  keyword: { color: "var(--syntax-keyword)" },
  string: { color: "var(--syntax-string)" },
  number: { color: "var(--syntax-number)" },
  comment: { color: "var(--syntax-comment)" },
} as Record<string, CSSProperties>;

export function getCursorStyle(
  caretShapeStyle: CaretShapeStyle,
): CSSProperties {
  switch (caretShapeStyle) {
    case CaretShapeStyle.Block:
      return cursorStyles.block;
    case CaretShapeStyle.Box:
      return cursorStyles.box;
    case CaretShapeStyle.Line:
      return cursorStyles.line;
    case CaretShapeStyle.Underline:
      return cursorStyles.underline;
  }
}

export function getTextStyle(
  {
    attrs,
    cls,
  }: {
    readonly attrs: number;
    readonly cls: string | null;
  },
  special: boolean,
): CSSProperties | undefined {
  switch (attrs) {
    case Attr.Normal:
    case Attr.Cursor: {
      return (
        syntaxStyles[cls ?? ""] ??
        (special ? textStyles.special : textStyles.normal)
      );
    }
    case Attr.Hit:
      return textStyles.hit;
    case Attr.Miss:
      return textStyles.miss;
    case Attr.Garbage:
      return textStyles.garbage;
  }
  return undefined;
}
