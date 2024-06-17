import { clsx } from "clsx";
import { type ReactNode } from "react";
import * as styles from "./Para.module.less";
import { type ParaProps } from "./Para.types.ts";

export function Para(props: ParaProps): ReactNode {
  const { as: Component = "p", id, title, className, children } = props;
  return (
    <Component id={id} className={clsx(styles.root, className)} title={title}>
      {children}
    </Component>
  );
}
