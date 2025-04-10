import { type ReactNode, type RefObject } from "react";
import {
  type Focusable,
  type FocusProps,
  type KeyboardProps,
  type MouseProps,
} from "../types.ts";

export type RadioBoxProps = {
  readonly checked?: boolean;
  readonly children?: ReactNode;
  readonly label?: ReactNode;
  readonly name?: string;
  readonly ref?: RefObject<RadioBoxRef | null>;
  readonly title?: string;
  readonly value?: string;
  readonly onChange?: (checked: boolean) => void;
  readonly onSelect?: (value?: string) => void;
} & FocusProps &
  MouseProps &
  KeyboardProps;

export type RadioBoxRef = Focusable;
