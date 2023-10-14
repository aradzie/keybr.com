import { type ReactNode } from "react";
import {
  type FocusProps,
  type KeyboardProps,
  type MouseProps,
} from "../props.ts";
import { type ClassName, type Focusable } from "../types.ts";

export type RadioBoxProps = {
  readonly checked?: boolean;
  readonly children?: ReactNode;
  readonly className?: ClassName;
  readonly label?: ReactNode;
  readonly name?: string;
  readonly title?: string;
  readonly value?: string;
  readonly onChange?: (checked: boolean) => void;
  readonly onSelect?: (value?: string) => void;
} & FocusProps &
  MouseProps &
  KeyboardProps;

export type RadioBoxRef = Focusable;
