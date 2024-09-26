import { ProgressBar } from "@keybr/widget";
import { type ReactNode } from "react";
import * as styles from "./LoadingProgress.module.less";

export function LoadingProgress({
  total = 0,
  current = 0,
}: {
  readonly total?: number;
  readonly current?: number;
}): ReactNode {
  return (
    <div className={styles.root}>
      <ProgressBar total={total} current={current} />
    </div>
  );
}
