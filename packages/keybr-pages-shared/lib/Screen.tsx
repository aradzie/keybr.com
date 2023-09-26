import { type ClassName } from "@keybr/widget";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import * as styles from "./Screen.module.less";

export function Screen({
  className,
  children,
}: {
  readonly className?: ClassName;
  readonly children?: ReactNode;
}): ReactNode {
  return (
    <section className={clsx(styles.screen, className)}>{children}</section>
  );
}
