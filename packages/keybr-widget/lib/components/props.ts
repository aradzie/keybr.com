import {
  type FocusEventHandler,
  type KeyboardEventHandler,
  type MouseEventHandler,
} from "react";

export type FocusProps = {
  readonly tabIndex?: number;
  readonly disabled?: boolean;
  readonly onFocus?: FocusEventHandler;
  readonly onBlur?: FocusEventHandler;
};

export type MouseProps = {
  readonly onClick?: MouseEventHandler;
  readonly onMouseDown?: MouseEventHandler;
  readonly onMouseUp?: MouseEventHandler;
  readonly onMouseOver?: MouseEventHandler;
  readonly onMouseOut?: MouseEventHandler;
  readonly onMouseEnter?: MouseEventHandler;
  readonly onMouseLeave?: MouseEventHandler;
};

export type KeyboardProps = {
  readonly onKeyDown?: KeyboardEventHandler;
  readonly onKeyUp?: KeyboardEventHandler;
};
