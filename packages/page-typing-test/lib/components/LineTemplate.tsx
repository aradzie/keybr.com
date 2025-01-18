import { memo, type ReactNode } from "react";
import { type SessionLine } from "../session/index.ts";
import * as styles from "./LineTemplate.module.less";

export const LineTemplate = memo(function LineTemplate({
  children,
  progress,
}: {
  children: ReactNode;
} & SessionLine) {
  return <div className={styles.root}>{children}</div>;
});
