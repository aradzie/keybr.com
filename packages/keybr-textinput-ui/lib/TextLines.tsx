import {
  type Char,
  charsAreEqual,
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
    sizeStyleName(size),
  );
  const children = useTextLines(
    settings,
    lines,
    className,
    settings.font.cssProperties,
    lineTemplate,
  );
  return cursor ? <Cursor settings={settings}>{children}</Cursor> : children;
});

function useTextLines(
  settings: TextDisplaySettings,
  lines: LineList,
  className: string,
  style: CSSProperties,
  LineTemplate?: ComponentType<any>,
): ReactNode {
  // TODO Use a memo to turn lines into nodes.
  return lines.lines.map(({ text, chars, ...props }: Line): ReactNode => {
    return LineTemplate != null ? (
      <LineTemplate key={text} {...props}>
        <TextLine
          key={text}
          settings={settings}
          chars={chars}
          className={className}
          style={style}
        />
      </LineTemplate>
    ) : (
      <TextLine
        key={text}
        settings={settings}
        chars={chars}
        className={className}
        style={style}
      />
    );
  });
}

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
    return (
      <div
        className={className}
        style={style}
        dir={settings.language.direction}
      >
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
