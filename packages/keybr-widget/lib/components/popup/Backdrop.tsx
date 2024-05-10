import { type ReactNode } from "react";
import * as styles from "./Backdrop.module.less";

export function Backdrop({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  return <div className={styles.root}>{children}</div>;
}
