import { ProgressBar } from "@keybr/widget";
import { type ReactNode } from "react";
import * as styles from "./LoadingProgress.module.less";

export function LoadingProgress({
  total,
  current,
}: {
  readonly total: number;
  readonly current: number;
}): ReactNode {
  return (
    <div className={styles.loadingProgress}>
      <ProgressBar total={total} current={current} />
    </div>
  );
}
