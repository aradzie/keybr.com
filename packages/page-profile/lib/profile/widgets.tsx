import { FieldList } from "@keybr/widget";
import { type ReactNode } from "react";
import * as styles from "./widgets.module.less";

export function ChartControls({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  return <FieldList className={styles.chartControls}>{children}</FieldList>;
}

export function ChartWrapper({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  return <div className={styles.chartWrapper}>{children}</div>;
}
