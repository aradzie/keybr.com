import { Direction } from "@keybr/layout";
import {
  type Char,
  charsAreEqual,
  type Line,
  type LineList,
  type TextDisplaySettings,
  textDisplaySettings,
} from "@keybr/textinput";
import { clsx } from "clsx";
import { type ComponentType, memo, type ReactNode } from "react";
import { renderChars, splitIntoItems } from "./chars.tsx";
import { Cursor } from "./Cursor.tsx";
import * as styles from "./TextLines.module.less";

export type TextLineSize = "X0" | "X1" | "X2" | "X3";

export const TextLines = memo(function TextLines({
  settings = textDisplaySettings,
  lines,
  wrap = true,
  size = "X0",
  lineTemplate,
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
    settings.direction === Direction.RTL ? styles.line_rtl : styles.line_ltr,
    sizeStyleName(size),
  );
  const children = useTextLines(settings, lines, className, lineTemplate);
  return cursor ? <Cursor settings={settings}>{children}</Cursor> : children;
});

function useTextLines(
  settings: TextDisplaySettings,
  lines: LineList,
  className: string,
  LineTemplate?: ComponentType<any>,
): ReactNode {
  // TODO Use a memo to turn lines into nodes.
  return lines.lines.map(({ text, chars, ...rest }: Line): ReactNode => {
    return LineTemplate != null ? (
      <LineTemplate key={text} {...rest}>
        <TextLine
          key={text}
          settings={settings}
          chars={chars}
          className={className}
        />
      </LineTemplate>
    ) : (
      <TextLine
        key={text}
        settings={settings}
        chars={chars}
        className={className}
      />
    );
  });
}

const TextLine = memo(
  function TextLine({
    settings,
    chars,
    className,
  }: {
    readonly settings: TextDisplaySettings;
    readonly chars: readonly Char[];
    readonly className: string;
  }): ReactNode {
    return (
      <div className={className}>
        {splitIntoItems(chars).map(({ chars }, index) => (
          <TextItem key={index} settings={settings} chars={chars} />
        ))}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.settings === nextProps.settings &&
      charsAreEqual(prevProps.chars, nextProps.chars) && // deep equality
      prevProps.className === nextProps.className
    );
  },
);

const TextItem = memo(
  function TextItem({
    settings,
    chars,
  }: {
    readonly settings: TextDisplaySettings;
    readonly chars: readonly Char[];
  }): ReactNode {
    return (
      <span className={styles.item}>
        {renderChars({
          settings,
          chars,
        })}
      </span>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.settings === nextProps.settings &&
      charsAreEqual(prevProps.chars, nextProps.chars) // deep equality
    );
  },
);

function sizeStyleName(size: TextLineSize): string {
  switch (size) {
    case "X0":
      return styles.size_X0;
    case "X1":
      return styles.size_X1;
    case "X2":
      return styles.size_X2;
    case "X3":
      return styles.size_X3;
  }
}
