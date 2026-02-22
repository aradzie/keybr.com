import { type LessonKey } from "@keybr/lesson";
import { type MouseProps } from "@keybr/widget";
import { clsx } from "clsx";
import * as styles from "./styles.module.less";
import { useKeyStyles } from "./styles.ts";

export const Key = ({
  lessonKey,
  isSelectable = false,
  isCurrent = false,
  size = "normal",
  title,
  ...props
}: {
  lessonKey: LessonKey;
  isSelectable?: boolean;
  isCurrent?: boolean;
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
        isSelectable && styles.lessonKey_selectable,
        isCurrent && styles.lessonKey_current,
      )}
      style={keyStyles(true, confidence)}
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
