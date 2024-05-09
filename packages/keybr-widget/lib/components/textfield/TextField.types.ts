import {
  type ClassName,
  type Focusable,
  type FocusProps,
  type KeyboardProps,
  type MouseProps,
  type Selectable,
} from "../types.ts";

export type TextFieldType = "text" | "textarea" | "email" | "url" | "password";

export type TextFieldProps = {
  readonly className?: ClassName;
  readonly maxLength?: number;
  readonly name?: string;
  readonly placeholder?: string;
  readonly title?: string;
  readonly type?: TextFieldType;
  readonly value?: string;
  readonly onChange?: (value: string) => void;
} & FocusProps &
  MouseProps &
  KeyboardProps;

export type TextFieldRef = Focusable & Selectable;
