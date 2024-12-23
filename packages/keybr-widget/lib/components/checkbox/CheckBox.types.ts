import { type ReactNode, type RefObject } from "react";
import {
  type Focusable,
  type FocusProps,
  type KeyboardProps,
  type MouseProps,
} from "../types.ts";

export type CheckBoxProps = {
  readonly checked?: boolean;
  readonly children?: ReactNode;
  readonly label?: ReactNode;
  readonly name?: string;
  readonly ref?: RefObject<CheckBoxRef | null>;
  readonly title?: string;
  readonly value?: string;
  readonly onChange?: (checked: boolean) => void;
} & FocusProps &
  MouseProps &
  KeyboardProps;

export type CheckBoxRef = Focusable;
