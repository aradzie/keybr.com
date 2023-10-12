import { type LessonKey } from "@keybr/lesson";
import { type Letter } from "@keybr/phonetic-model";
import { type ClassName, type MouseProps } from "@keybr/widget";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import { keyStyle } from "./color.ts";
import * as styles from "./styles.module.less";

export const Key = ({
  className,
  lessonKey,
  isSelectable = false,
  isCurrent = false,
  size = "normal",
  title,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
}: {
  readonly className?: ClassName;
  readonly lessonKey: LessonKey;
  readonly isSelectable?: boolean;
  readonly isCurrent?: boolean;
  readonly size?: "normal" | "large" | "announcement";
  readonly title?: string;
} & MouseProps): ReactNode => {
  const {
    letter: { codePoint, label },
    confidence,
    isIncluded,
    isBoosted,
    isForced,
  } = lessonKey;
  return (
    <span
      key={codePoint}
      className={clsx(
        styles.lessonKey,
        size === "normal" && styles.lessonKey_normal,
        size === "large" && styles.lessonKey_large,
        size === "announcement" && styles.lessonKey_announcement,
        isIncluded ? styles.lessonKey_included : styles.lessonKey_excluded,
        isIncluded && confidence == null && styles.lessonKey_uncalibrated,
        isIncluded && isBoosted && styles.lessonKey_boosted,
        isIncluded && isForced && styles.lessonKey_forced,
        isSelectable && styles.lessonKey_selectable,
        isCurrent && styles.lessonKey_current,
        className,
      )}
      style={keyStyle(true, confidence)}
      title={title}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      data-code-point={codePoint}
    >
      {label}
      {isIncluded || (
        <svg viewBox="0 0 100 100" className={styles.cross}>
          <path d="M 0 100 L 100 0" />
        </svg>
      )}
    </span>
  );
};

Key.selector = ({ codePoint }: Letter): string => {
  return `[data-code-point="${codePoint}"]`;
};

Key.isKey = (el: EventTarget): number | null => {
  if (el instanceof HTMLElement) {
    const value = el.dataset["codePoint"] ?? null;
    if (value != null) {
      return Number(value);
    }
  }
  return null;
};
