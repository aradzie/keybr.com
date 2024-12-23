import { type ReactElement, type ReactNode, type RefObject } from "react";
import { type SizeName } from "../../styles/index.ts";
import { type IconProps } from "../icon/Icon.types.ts";
import {
  type AnchorProps,
  type Focusable,
  type FocusProps,
  type KeyboardProps,
  type MouseProps,
} from "../types.ts";

export type ButtonProps = {
  readonly autoFocus?: boolean;
  readonly children?: ReactNode;
  readonly icon?: ReactElement<IconProps>;
  readonly label?: ReactNode;
  readonly ref?: RefObject<ButtonRef | null>;
  readonly size?: SizeName;
  readonly title?: string;
} & FocusProps &
  MouseProps &
  KeyboardProps &
  AnchorProps;

export type ButtonRef = Focusable;
