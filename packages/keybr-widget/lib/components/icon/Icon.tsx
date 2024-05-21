import { clsx } from "clsx";
import { memo, type ReactNode } from "react";
import * as styles from "./Icon.module.less";
import { type IconProps } from "./Icon.types.ts";

export const Icon = memo(function Icon({
  shape,
  className,
  viewBox = "0 0 24 24",
  ...props
}: IconProps): ReactNode {
  return (
    <svg {...props} className={clsx(styles.root, className)} viewBox={viewBox}>
      <path d={shape} />
    </svg>
  );
});
