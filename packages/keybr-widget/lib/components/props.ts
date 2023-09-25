import {
  type FocusEventHandler,
  type KeyboardEventHandler,
  type MouseEventHandler,
} from "react";

export type FocusProps = {
  readonly tabIndex?: number;
  readonly disabled?: boolean;
  readonly onBlur?: FocusEventHandler;
  readonly onFocus?: FocusEventHandler;
};

export type MouseProps = {
  readonly onClick?: MouseEventHandler;
  readonly onMouseDown?: MouseEventHandler;
  readonly onMouseEnter?: MouseEventHandler;
  readonly onMouseLeave?: MouseEventHandler;
  readonly onMouseUp?: MouseEventHandler;
};

export type KeyboardProps = {
  readonly onKeyDown?: KeyboardEventHandler;
  readonly onKeyUp?: KeyboardEventHandler;
};
