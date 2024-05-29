import {
  type FocusEventHandler,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type RefObject,
  type WheelEventHandler,
} from "react";
import { type Anchor } from "../floating/index.ts";

export type ClassName = any;

export type Focusable = {
  blur(): void;
  focus(): void;
};

export type Selectable = {
  select(): void;
};

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

export type WheelProps = {
  readonly onWheel?: WheelEventHandler;
};

export type KeyboardProps = {
  readonly onKeyDown?: KeyboardEventHandler;
  readonly onKeyUp?: KeyboardEventHandler;
};

export type AnchorProps = {
  readonly anchor?: RefObject<Anchor>;
  readonly disabled?: boolean;
};
