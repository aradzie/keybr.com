import {
  attrCursor,
  attrGarbage,
  attrHit,
  attrMiss,
  attrNormal,
  type Char,
} from "@keybr/textinput";
import {
  type TextDisplaySettings,
  WhitespaceStyle,
} from "@keybr/textinput-settings";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import * as styles from "./chars.module.less";

export const cn = {
  chars: styles.chars,
  charsNormal: styles.chars_normal,
  charsSpecial: styles.chars_special,
  charsHit: styles.chars_hit,
  charsMiss: styles.chars_miss,
  charsGarbage: styles.chars_garbage,
  charsCursor: styles.chars_cursor,
};

const tabChar = "\u21B9";
const newlineChar = "\u21B5";
const spaceChar = "\u00A0";
const spaceBarChar = "\u2423";
const spaceBulletChar = "\u2E31";

type Item = {
  readonly chars: readonly Char[];
};

export function splitIntoItems(chars: readonly Char[]): readonly Item[] {
  const { length } = chars;
  const items: Item[] = [];
  let itemChars: Char[] = [];
  for (let i = 0; i < length; i++) {
    const char = chars[i];
    itemChars.push(char);
    switch (char.codePoint) {
      case 0x0009:
      case 0x000a:
      case 0x0020:
        if (itemChars.length > 0) {
          items.push({ chars: itemChars });
          itemChars = [];
        }
        break;
      default:
        break;
    }
  }
  if (itemChars.length > 0) {
    items.push({ chars: itemChars });
    itemChars = [];
  }
  return items;
}

type Span = {
  readonly chars: number[];
  readonly attrs: number;
};

const br: Span = { chars: [], attrs: -1 };

export function renderChars({
  settings,
  chars,
}: {
  readonly settings: TextDisplaySettings;
  readonly chars: readonly Char[];
}): readonly ReactNode[] {
  const nodes: ReactNode[] = [];

  let span: Span = br;

  const pushSpan = (nextSpan: Span): void => {
    if (span.chars.length > 0) {
      nodes.push(
        <span key={nodes.length} className={normalClassName(span.attrs)}>
          {String.fromCodePoint(...span.chars)}
        </span>,
      );
    }

    span = nextSpan;
  };

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const { codePoint, attrs } = char;
    if (codePoint > 32) {
      if (span.attrs !== attrs) {
        pushSpan({ chars: [], attrs });
      }
      span.chars.push(codePoint);
    } else {
      switch (codePoint) {
        case 0x0009: {
          pushSpan(br);
          nodes.push(
            <span key={nodes.length} className={specialClassName(attrs)}>
              {tabChar}
            </span>,
          );
          break;
        }
        case 0x000a: {
          pushSpan(br);
          nodes.push(
            <span key={nodes.length} className={specialClassName(attrs)}>
              {newlineChar}
            </span>,
          );
          break;
        }
        case 0x0020: {
          pushSpan(br);
          nodes.push(
            <span key={nodes.length} className={specialClassName(attrs)}>
              {whitespaceChar(settings.whitespaceStyle)}
            </span>,
          );
          break;
        }
        default: {
          pushSpan(br);
          nodes.push(
            <span key={nodes.length} className={normalClassName(attrs)}>
              {`U+${codePoint.toString(16).padStart(4, "0")}`}
            </span>,
          );
          break;
        }
      }
    }
  }

  pushSpan(br);

  return nodes;
}

function whitespaceChar(whitespaceStyle: WhitespaceStyle): string {
  switch (whitespaceStyle) {
    case WhitespaceStyle.Space:
      return spaceChar;
    case WhitespaceStyle.Bar:
      return spaceBarChar;
    case WhitespaceStyle.Bullet:
      return spaceBulletChar;
  }
}

const cnNormal = {
  [attrNormal]: clsx([styles.chars, styles.chars_normal]),
  [attrHit]: clsx([styles.chars, styles.chars_hit]),
  [attrMiss]: clsx([styles.chars, styles.chars_miss]),
  [attrGarbage]: clsx([styles.chars, styles.chars_garbage]),
  [attrCursor]: clsx([styles.chars, styles.chars_cursor]),
};

const cnSpecial = {
  [attrNormal]: clsx([styles.chars, styles.chars_special]),
  [attrHit]: clsx([styles.chars, styles.chars_hit]),
  [attrMiss]: clsx([styles.chars, styles.chars_miss]),
  [attrGarbage]: clsx([styles.chars, styles.chars_garbage]),
  [attrCursor]: clsx([styles.chars, styles.chars_cursor]),
};

function normalClassName(attrs: number): string {
  return cnNormal[attrs] ?? "";
}

function specialClassName(attrs: number): string {
  return cnSpecial[attrs] ?? "";
}
