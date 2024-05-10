import { clsx } from "clsx";
import { type ReactNode } from "react";
import { type FloatingPosition } from "../../floating/index.ts";
import * as styles from "./Slide.module.less";

export type SlideProps = {
  readonly anchor?: string;
  readonly children?: ReactNode;
  readonly className?: string;
  readonly position?: FloatingPosition;
  readonly size?: "small" | "large";
};

export function Slide({
  anchor,
  children,
  className,
  position,
  size,
  ...props
}: SlideProps): ReactNode {
  return (
    <div
      {...props}
      className={clsx(
        styles.root,
        size === "small" && styles.small,
        size === "large" && styles.large,
        className,
      )}
    >
      {children}
    </div>
  );
}
