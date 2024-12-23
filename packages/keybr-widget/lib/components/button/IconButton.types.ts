import { type ReactElement, type ReactNode, type RefObject } from "react";
import { type IconProps } from "../icon/Icon.types.ts";
import {
  type AnchorProps,
  type Focusable,
  type FocusProps,
  type KeyboardProps,
  type MouseProps,
} from "../types.ts";

export type IconButtonProps = {
  readonly autoFocus?: boolean;
  readonly children?: ReactNode;
  readonly icon: ReactElement<IconProps>;
  readonly label?: ReactNode;
  readonly ref?: RefObject<IconButtonRef | null>;
  readonly title?: string;
} & FocusProps &
  MouseProps &
  KeyboardProps &
  AnchorProps;

export type IconButtonRef = Focusable;
