import {
  attrCursor,
  attrGarbage,
  attrHit,
  attrMiss,
  attrNormal,
  type Char,
  type TextDisplaySettings,
  WhitespaceStyle,
} from "@keybr/textinput";
import { type ReactNode } from "react";
import * as styles from "./chars.module.less";

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
    if (codePoint > 0x0020) {
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
              {"\uE002"}
            </span>,
          );
          break;
        }
        case 0x000a: {
          pushSpan(br);
          nodes.push(
            <span key={nodes.length} className={specialClassName(attrs)}>
              {"\uE003"}
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
      return "\u00A0";
    case WhitespaceStyle.Bar:
      return "\uE001";
    case WhitespaceStyle.Bullet:
      return "\uE000";
  }
}

const cnNormal = {
  [attrNormal]: styles.normal,
  [attrHit]: styles.hit,
  [attrMiss]: styles.miss,
  [attrGarbage]: styles.garbage,
  [attrCursor]: styles.cursor,
};

const cnSpecial = {
  [attrNormal]: styles.special,
  [attrHit]: styles.hit,
  [attrMiss]: styles.miss,
  [attrGarbage]: styles.garbage,
  [attrCursor]: styles.cursor,
};

function normalClassName(attrs: number): string {
  return cnNormal[attrs] ?? "";
}

function specialClassName(attrs: number): string {
  return cnSpecial[attrs] ?? "";
}

const cursorSelector = `.${styles.cursor}`;

export function findCursor(container: HTMLElement): HTMLElement | null {
  return container.querySelector<HTMLElement>(cursorSelector) ?? null;
}
