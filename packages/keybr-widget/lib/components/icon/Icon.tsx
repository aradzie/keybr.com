import { clsx } from "clsx";
import { memo, type ReactNode } from "react";
import * as styles from "./Icon.module.less";
import { type IconProps } from "./Icon.types.ts";

export const Icon = memo(function Icon(props: IconProps): ReactNode {
  const { shape, className, viewBox = "0 0 24 24", ...rest } = props;
  return (
    <svg className={clsx(styles.icon, className)} viewBox={viewBox} {...rest}>
      <path d={shape} />
    </svg>
  );
});
