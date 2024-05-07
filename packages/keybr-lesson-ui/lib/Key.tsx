import { type LessonKey } from "@keybr/lesson";
import { type Letter } from "@keybr/phonetic-model";
import { type MouseProps } from "@keybr/widget";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import { keyStyle } from "./color.ts";
import * as styles from "./styles.module.less";

export const Key = ({
  lessonKey,
  isSelectable = false,
  isCurrent = false,
  size = "normal",
  title,
  ...props
}: {
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
    isFocused,
    isForced,
  } = lessonKey;
  return (
    <span
      {...props}
      key={codePoint}
      className={clsx(
        styles.lessonKey,
        size === "normal" && styles.lessonKey_normal,
        size === "large" && styles.lessonKey_large,
        size === "announcement" && styles.lessonKey_announcement,
        isIncluded ? styles.lessonKey_included : styles.lessonKey_excluded,
        isIncluded && confidence == null && styles.lessonKey_uncalibrated,
        isIncluded && isFocused && styles.lessonKey_focused,
        isIncluded && isForced && styles.lessonKey_forced,
        isSelectable && styles.lessonKey_selectable,
        isCurrent && styles.lessonKey_current,
      )}
      style={keyStyle(true, confidence)}
      title={title}
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

export function getKeyElementSelector({ codePoint }: Letter): string {
  return `.${styles.lessonKey}[data-code-point="${codePoint}"]`;
}

export function isKeyElement(el: Element): number | null {
  if (el instanceof HTMLElement && el.className.includes(styles.lessonKey)) {
    const value = el.dataset["codePoint"] ?? null;
    if (value != null) {
      return Number(value);
    }
  }
  return null;
}
