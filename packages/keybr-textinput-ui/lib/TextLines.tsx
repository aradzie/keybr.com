import {
  type Char,
  charArraysAreEqual,
  type Line,
  type LineList,
  type TextDisplaySettings,
  textDisplaySettings,
} from "@keybr/textinput";
import { clsx } from "clsx";
import {
  type ComponentType,
  type CSSProperties,
  memo,
  type ReactNode,
} from "react";
import { renderChars } from "./chars.tsx";
import { Cursor } from "./Cursor.tsx";
import { textItemStyle } from "./styles.ts";
import * as styles from "./TextLines.module.less";

export type TextLineSize = "X0" | "X1" | "X2" | "X3";

export const TextLines = memo(function TextLines({
  settings = textDisplaySettings,
  lines,
  wrap = true,
  size = "X0",
  lineTemplate: LineTemplate,
  cursor,
  focus,
}: {
  readonly lines: LineList;
  readonly settings?: TextDisplaySettings;
  readonly wrap?: boolean;
  readonly size?: TextLineSize;
  readonly lineTemplate?: ComponentType<any>;
  readonly cursor: boolean;
  readonly focus: boolean;
}): ReactNode {
  const className = clsx(
    styles.line,
    wrap ? styles.line_wrap : styles.line_nowrap,
    focus ? styles.text_focus : styles.text_blur,
    size === "X0" && styles.size_X0,
    size === "X1" && styles.size_X1,
    size === "X2" && styles.size_X2,
    size === "X3" && styles.size_X3,
  );
  const children = lines.lines.map(({ text, chars, ...props }: Line) =>
    LineTemplate != null ? (
      <LineTemplate key={text} {...props}>
        <TextLine
          key={text}
          settings={settings}
          chars={chars}
          className={className}
          style={settings.font.cssProperties}
        />
      </LineTemplate>
    ) : (
      <TextLine
        key={text}
        settings={settings}
        chars={chars}
        className={className}
        style={settings.font.cssProperties}
      />
    ),
  );
  return cursor ? <Cursor settings={settings}>{children}</Cursor> : children;
});

const TextLine = memo(
  function TextLine({
    settings,
    chars,
    className,
    style,
  }: {
    readonly settings: TextDisplaySettings;
    readonly chars: readonly Char[];
    readonly className: string;
    readonly style: CSSProperties;
  }): ReactNode {
    const items: Char[][] = [];
    let itemChars: Char[] = [];
    let ws = false;
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      switch (char.codePoint) {
        case 0x0009:
        case 0x000a:
        case 0x0020:
          ws = true;
          break;
        default:
          if (ws) {
            if (itemChars.length > 0) {
              items.push(itemChars);
              itemChars = [];
            }
            ws = false;
          }
          break;
      }
      itemChars.push(char);
    }
    if (itemChars.length > 0) {
      items.push(itemChars);
      itemChars = [];
    }
    return (
      <div
        className={className}
        style={style}
        dir={settings.language.direction}
      >
        {items.map((chars, index) => (
          <TextItem key={index} settings={settings} chars={chars} />
        ))}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.settings === nextProps.settings &&
    charArraysAreEqual(prevProps.chars, nextProps.chars) && // deep equality
    prevProps.className === nextProps.className,
);

const TextItem = memo(
  function TextItem({
    settings,
    chars,
  }: {
    readonly settings: TextDisplaySettings;
    readonly chars: readonly Char[];
  }): ReactNode {
    return <span style={textItemStyle}>{renderChars(settings, chars)}</span>;
  },
  (prevProps, nextProps) =>
    prevProps.settings === nextProps.settings &&
    charArraysAreEqual(prevProps.chars, nextProps.chars), // deep equality
);
