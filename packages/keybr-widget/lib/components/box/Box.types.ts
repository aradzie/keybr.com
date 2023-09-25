import { type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { type ClassName } from "../types.ts";

export type BoxDirection = "row" | "column";

export type BoxWrap = "wrap" | "wrap-reverse" | "nowrap";

export type BoxJustifyContent =
  | "start"
  | "end"
  | "center"
  | "space-between"
  | "space-around";

export type BoxAlignItems = "start" | "end" | "center" | "baseline" | "stretch";

export type BoxAlignContent =
  | "start"
  | "end"
  | "center"
  | "space-between"
  | "space-around"
  | "stretch";

export type BoxProps = {
  readonly direction?: BoxDirection;
  readonly wrap?: BoxWrap;
  readonly justifyContent?: BoxJustifyContent;
  readonly alignItems?: BoxAlignItems;
  readonly alignContent?: BoxAlignContent;
  readonly as?: ElementType<HTMLAttributes<HTMLElement>>;
  readonly className?: ClassName;
  readonly id?: string;
  readonly title?: string;
  readonly children?: ReactNode;
};

export type HBoxProps = Omit<BoxProps, "direction">;

export type VBoxProps = Omit<BoxProps, "direction">;
