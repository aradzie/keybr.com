import { type ReactNode } from "react";
import * as styles from "./Root.module.less";

export function Root({
  children,
}: {
  readonly children?: ReactNode;
}): ReactNode {
  return <div id={styles.root}>{children}</div>;
}

Root.selector = `#${styles.root}`;
