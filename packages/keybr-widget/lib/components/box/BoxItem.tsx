import "./BoxItem.module.less";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import { type BoxItemProps } from "./BoxItem.types.ts";
import { getBoxItemClassNames } from "./classNames.ts";

export function BoxItem(props: BoxItemProps): ReactNode {
  const { as: Component = "div", className, id, title, children } = props;
  return (
    <Component
      id={id}
      className={clsx(getBoxItemClassNames(props), className)}
      title={title}
    >
      {children}
    </Component>
  );
}
