import { clsx } from "clsx";
import { type ReactNode } from "react";
import * as styles from "./Link.module.less";
import { type LinkProps } from "./Link.types.ts";

export function Link({
  as: Component = "a",
  id,
  className,
  href,
  target,
  download,
  title,
  children,
  ...props
}: LinkProps): ReactNode {
  return (
    <Component
      {...props}
      id={id}
      className={clsx(styles.root, className)}
      href={href}
      target={target}
      download={download}
      title={title}
    >
      {children}
    </Component>
  );
}
