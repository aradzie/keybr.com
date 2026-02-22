import { type LessonKey } from "@keybr/lesson";
import { type MouseProps } from "@keybr/widget";
import { clsx } from "clsx";
import * as styles from "./styles.module.less";
import { useKeyStyles } from "./styles.ts";

export const Key = ({
  lessonKey,
  isSelectable = false,
  isCurrent = false,
  isManuallyLocked = false,
  size = "normal",
  title,
  ...props
}: {
  lessonKey: LessonKey;
  isSelectable?: boolean;
  isCurrent?: boolean;
  isManuallyLocked?: boolean;
  size?: "normal" | "large" | "announcement";
  title?: string;
} & MouseProps) => {
  const { keyStyles } = useKeyStyles();
  const {
    letter: { codePoint, label },
    confidence,
    isIncluded,
    isFocused,
    isForced,
  } = lessonKey;
  const isLocked = isManuallyLocked;
  return (
    <span
      {...props}
      ref={Key.attach(lessonKey)}
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
        isManuallyLocked && styles.lessonKey_manuallyLocked,
        isSelectable && styles.lessonKey_selectable,
        isCurrent && styles.lessonKey_current,
      )}
      style={keyStyles(true, confidence)}
      title={
        title ??
        (isManuallyLocked
          ? "Manually locked (click to unlock)"
          : "Click to lock")
      }
      data-code-point={codePoint}
    >
      {label}
      {isManuallyLocked && (
        <svg viewBox="0 0 100 100" className={styles.lockIcon}>
          <path d="M 30 50 L 30 35 A 20 20 0 0 1 70 35 L 70 50 M 30 50 L 30 80 L 70 80 L 70 50 Z" />
          <circle cx="50" cy="65" r="5" />
        </svg>
      )}
      {!isIncluded && !isManuallyLocked && (
        <svg viewBox="0 0 100 100" className={styles.cross}>
          <path d="M 0 100 L 100 0" />
        </svg>
      )}
    </span>
  );
};

const attachment = Symbol();

Key.attach = (key: LessonKey) => {
  return (target: Element | null): void => {
    if (target != null) {
      (target as any)[attachment] = key;
    }
  };
};

Key.attached = (target: Element | null): LessonKey | null => {
  return (target as any)?.[attachment] ?? null;
};
