import { type ReactNode } from "react";
import * as styles from "./ScreenCover.module.less";

export function ScreenCover({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  return <div className={styles.root}>{children}</div>;
}
