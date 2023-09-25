import { clsx } from "clsx";
import { type ReactNode } from "react";
import * as styles from "./Slide.module.less";

export type SlideProps = {
  readonly className?: string;
  readonly children?: ReactNode;
  readonly size?: "small" | "normal" | "large";
  readonly target?: string;
  readonly position?: "e" | "s" | "w" | "n";
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
