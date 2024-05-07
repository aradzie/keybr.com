import { type MouseProps } from "@keybr/widget";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import { keyStyle } from "./color.ts";
import * as styles from "./styles.module.less";

export const KeyLegend = ({
  confidence,
  isIncluded,
  isFocused,
  isForced,
  size = "normal",
  title,
  ...props
}: {
  readonly confidence: number | null;
  readonly isIncluded: boolean;
  readonly isFocused: boolean;
  readonly isForced: boolean;
  readonly size?: "normal" | "large";
  readonly title?: string;
} & MouseProps): ReactNode => {
  return (
    <span
      {...props}
      className={clsx(
        styles.lessonKey,
        size === "normal" && styles.lessonKey_normal,
        size === "large" && styles.lessonKey_large,
        isIncluded ? styles.lessonKey_included : styles.lessonKey_excluded,
        isIncluded && confidence == null && styles.lessonKey_uncalibrated,
        isIncluded && isFocused && styles.lessonKey_focused,
        isIncluded && isForced && styles.lessonKey_forced,
      )}
      style={keyStyle(isIncluded ?? false, confidence ?? null)}
      title={title}
    >
      ?
      {isIncluded || (
        <svg viewBox="0 0 100 100" className={styles.cross}>
          <path d="M 0 100 L 100 0" />
        </svg>
      )}
    </span>
  );
};
