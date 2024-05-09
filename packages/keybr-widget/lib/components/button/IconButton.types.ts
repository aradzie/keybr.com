import { type ReactElement, type ReactNode } from "react";
import { type IconProps } from "../icon/Icon.types.ts";
import {
  type AnchorProps,
  type ClassName,
  type Focusable,
  type FocusProps,
  type KeyboardProps,
  type MouseProps,
} from "../types.ts";

export type IconButtonProps = {
  readonly autoFocus?: boolean;
  readonly children?: ReactNode;
  readonly className?: ClassName;
  readonly href?: string;
  readonly icon: ReactElement<IconProps>;
  readonly label?: ReactNode;
  readonly target?: string;
  readonly title?: string;
} & FocusProps &
  MouseProps &
  KeyboardProps &
  AnchorProps;

export type IconButtonRef = Focusable;
