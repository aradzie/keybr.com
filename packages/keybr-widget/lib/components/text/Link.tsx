import { clsx } from "clsx";
import { type ReactNode } from "react";
import * as styles from "./Link.module.less";
import { type LinkProps } from "./Link.types.ts";

export function Link(props: LinkProps): ReactNode {
  const {
    as: Component = "a",
    id,
    className,
    href,
    target,
    download,
    external,
    title,
    children,
    ...rest
  } = props;
  return (
    <Component
      id={id}
      className={clsx(styles.link, external && styles.externalLink, className)}
      href={href}
      target={target}
      download={download}
      title={title}
      {...rest}
    >
      {children}
    </Component>
  );
}
