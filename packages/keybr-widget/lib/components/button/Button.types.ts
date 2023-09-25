import { type ReactElement, type ReactNode } from "react";
import { type IconProps } from "../icon/Icon.types.ts";
import {
  type FocusProps,
  type KeyboardProps,
  type MouseProps,
} from "../props.ts";
import { type ClassName } from "../types.ts";

export type ButtonProps = {
  readonly children?: ReactNode;
  readonly className?: ClassName;
  readonly href?: string;
  readonly icon?: ReactElement<IconProps>;
  readonly label?: ReactNode;
  readonly target?: string;
  readonly title?: string;
} & FocusProps &
  MouseProps &
  KeyboardProps;
