import { clsx } from "clsx";
import { type ReactNode } from "react";
import { type FloatingPosition } from "../../floating/index.ts";
import * as styles from "./Slide.module.less";

export type SlideProps = {
  readonly anchor?: string;
  readonly children?: ReactNode;
  readonly className?: string;
  readonly position?: FloatingPosition;
  readonly size?: "small" | "normal" | "large";
};

export function Slide({ className, children, size }: SlideProps): ReactNode {
  let styleName;
  switch (size) {
    case "small":
      styleName = styles.slide_small;
      break;
    case "large":
      styleName = styles.slide_large;
      break;
  }

  return (
    <div className={clsx(styles.slide, styleName, className)}>{children}</div>
  );
}
