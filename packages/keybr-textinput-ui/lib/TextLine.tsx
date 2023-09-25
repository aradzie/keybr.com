import { type Char, charsAreEqual } from "@keybr/textinput";
import { type TextDisplaySettings } from "@keybr/textinput-settings";
import { clsx } from "clsx";
import { memo, type ReactNode } from "react";
import { renderChars, splitIntoItems } from "./chars.tsx";
import * as styles from "./TextLine.module.less";

export const TextItem = memo(
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

export const TextLine = memo(
  function TextLine({
    settings,
    chars,
    wrap,
  }: {
    readonly settings: TextDisplaySettings;
    readonly chars: readonly Char[];
    readonly wrap: boolean;
  }): ReactNode {
    return (
      <div
        className={clsx(
          styles.line, //
          wrap ? styles.line_wrap : styles.line_nowrap,
        )}
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
      prevProps.wrap === nextProps.wrap
    );
  },
);
