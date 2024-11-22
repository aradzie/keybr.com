import { type MouseProps } from "@keybr/widget";
import { clsx } from "clsx";
import * as styles from "./styles.module.less";
import { useKeyStyles } from "./styles.ts";

export const KeyLegend = ({
  confidence,
  isIncluded,
  isFocused,
  isForced,
  size = "normal",
  title,
  ...props
}: {
  confidence: number | null;
  isIncluded: boolean;
  isFocused: boolean;
  isForced: boolean;
  size?: "normal" | "large";
  title?: string;
} & MouseProps) => {
  const { keyStyles } = useKeyStyles();
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
      style={keyStyles(isIncluded ?? false, confidence ?? null)}
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
