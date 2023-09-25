import { type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { type ClassName } from "../types.ts";

export type BoxItemSize = "fit" | "fill" | "fillAlt";

export type BoxItemGrow = 1 | 2 | 3 | 4 | 5;

export type BoxItemOrder = "none" | "first" | "last";

export type BoxSelfAlign = "start" | "end" | "center" | "baseline" | "stretch";

export type BoxItemProps = {
  readonly size?: BoxItemSize;
  readonly grow?: BoxItemGrow;
  readonly order?: BoxItemOrder;
  readonly selfAlign?: BoxSelfAlign;
  readonly as?: ElementType<HTMLAttributes<HTMLElement>>;
  readonly className?: ClassName;
  readonly id?: string;
  readonly title?: string;
  readonly children?: ReactNode;
};
