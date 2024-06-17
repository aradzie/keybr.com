import { clsx } from "clsx";
import { type ReactNode } from "react";
import * as styles from "./Description.module.less";
import { type DescriptionProps } from "./Description.types.ts";

export function Description(props: DescriptionProps): ReactNode {
  const { as: Component = "p", id, title, className, children } = props;
  return (
    <Component id={id} className={clsx(styles.root, className)} title={title}>
      {children}
    </Component>
  );
}
