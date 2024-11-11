import { type SizeName } from "../../styles/index.ts";
import {
  type Focusable,
  type FocusProps,
  type KeyboardProps,
  type MouseProps,
  type Selectable,
} from "../types.ts";

export type TextFieldType = "text" | "textarea" | "email" | "url" | "password";

export type TextFieldProps = {
  readonly maxLength?: number;
  readonly name?: string;
  readonly placeholder?: string;
  readonly size?: SizeName;
  readonly title?: string;
  readonly type?: TextFieldType;
  readonly value?: string;
  readonly onChange?: (value: string) => void;
  readonly onInput?: (event: InputEvent) => void;
} & FocusProps &
  MouseProps &
  KeyboardProps;

export type TextFieldRef = Focusable & Selectable;
