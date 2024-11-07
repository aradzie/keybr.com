import { memo, type ReactNode } from "react";
import { type SessionLine } from "../session/index.ts";
import * as styles from "./LineTemplate.module.less";

export const LineTemplate = memo(function LineTemplate({
  children,
  progress,
}: {
  readonly children: ReactNode;
} & SessionLine) {
  return <div className={styles.line}>{children}</div>;
});
