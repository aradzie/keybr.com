import { clsx } from "clsx";
import { type ReactNode } from "react";
import * as styles from "./Spacer.module.less";
import { type SpacerProps } from "./Spacer.types.ts";

export function Spacer({ size }: SpacerProps): ReactNode {
  return (
    <div
      className={clsx(styles.root, {
        [styles.size1]: size === 1,
        [styles.size2]: size === 2,
        [styles.size3]: size === 3,
        [styles.size4]: size === 4,
        [styles.size5]: size === 5,
      })}
    />
  );
}
