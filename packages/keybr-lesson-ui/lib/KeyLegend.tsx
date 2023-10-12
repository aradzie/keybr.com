import { type ClassName, type MouseProps } from "@keybr/widget";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import { keyStyle } from "./color.ts";
import * as styles from "./styles.module.less";

export const KeyLegend = ({
  className,
  confidence,
  isIncluded,
  isBoosted,
  isForced,
  size = "normal",
  title,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
}: {
  readonly className?: ClassName;
  readonly confidence: number | null;
  readonly isIncluded: boolean;
  readonly isBoosted: boolean;
  readonly isForced: boolean;
  readonly size?: "normal" | "large";
  readonly title?: string;
} & MouseProps): ReactNode => {
  return (
    <span
      className={clsx(
        styles.lessonKey,
        size === "normal" && styles.lessonKey_normal,
        size === "large" && styles.lessonKey_large,
        isIncluded ? styles.lessonKey_included : styles.lessonKey_excluded,
        isIncluded && confidence == null && styles.lessonKey_uncalibrated,
        isIncluded && isBoosted && styles.lessonKey_boosted,
        isIncluded && isForced && styles.lessonKey_forced,
        className,
      )}
      style={keyStyle(isIncluded ?? false, confidence ?? null)}
      title={title}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
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
