import { type ReactNode } from "react";
import type { MouseProps } from "../props.ts";
import * as styles from "./Award.module.less";
import { toastProps, useToast } from "./context.tsx";

export function Award({
  icon,
  children,
  ...rest
}: {
  readonly icon: ReactNode;
  readonly children: ReactNode;
} & MouseProps): ReactNode {
  const toast = useToast();
  return (
    <div className={styles.award} {...rest} {...toastProps(toast)}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.message}>{children}</div>
    </div>
  );
}
