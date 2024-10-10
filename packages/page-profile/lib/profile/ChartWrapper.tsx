import { type ReactNode } from "react";
import * as styles from "./ChartWrapper.module.less";

export function ChartWrapper({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  return <div className={styles.root}>{children}</div>;
}
