import "./Box.module.less";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import { type BoxProps, type HBoxProps, type VBoxProps } from "./Box.types.ts";
import { getBoxClassNames } from "./classNames.ts";

export function Box(props: BoxProps): ReactNode {
  const { as: Component = "div", className, id, title, children } = props;
  return (
    <Component
      id={id}
      className={clsx(getBoxClassNames(props), className)}
      title={title}
    >
      {children}
    </Component>
  );
}

export function HBox({ ...props }: HBoxProps): ReactNode {
  return (
    <Box direction="row" {...props}>
      {props.children}
    </Box>
  );
}

export function VBox({ ...props }: VBoxProps): ReactNode {
  return (
    <Box direction="column" {...props}>
      {props.children}
    </Box>
  );
}
