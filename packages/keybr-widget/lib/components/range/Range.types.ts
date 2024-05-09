import {
  type ClassName,
  type Focusable,
  type FocusProps,
  type KeyboardProps,
  type MouseProps,
} from "../types.ts";

export type RangeProps = {
  readonly className?: ClassName;
  readonly max: number;
  readonly min: number;
  readonly name?: string;
  readonly step: number;
  readonly title?: string;
  readonly value: number;
  readonly onChange?: (value: number) => void;
} & FocusProps &
  MouseProps &
  KeyboardProps;

export type RangeRef = Focusable;
