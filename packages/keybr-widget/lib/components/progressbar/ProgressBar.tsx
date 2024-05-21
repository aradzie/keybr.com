import { clsx } from "clsx";
import { type ReactNode } from "react";
import * as styles from "./ProgressBar.module.less";
import { type ProgressBarProps } from "./ProgressBar.types.ts";

export function ProgressBar({
  className,
  total,
  current,
}: ProgressBarProps): ReactNode {
  if (Number.isFinite(total) && Number.isFinite(current) && total > 0) {
    const value = Math.round(Math.max(0, Math.min(1, current / total)) * 100);
    return (
      <div className={clsx(styles.root, className)}>
        <div
          className={clsx(styles.bar, styles.determined)}
          style={{ inlineSize: `${value}%` }}
        />
      </div>
    );
  } else {
    return (
      <div className={clsx(styles.root, className)}>
        <div
          className={clsx(styles.bar, styles.intermediate)}
          style={{ inlineSize: "100%" }}
        />
      </div>
    );
  }
}
