import { clsx } from "clsx";
import { type ReactNode } from "react";
import * as styles from "./Kbd.module.less";
import { type KbdProps } from "./Kbd.types.ts";

export function Kbd(props: KbdProps): ReactNode {
  const { as: Component = "kbd", id, title, className, children } = props;
  return (
    <Component id={id} className={clsx(styles.root, className)} title={title}>
      {children}
    </Component>
  );
}
