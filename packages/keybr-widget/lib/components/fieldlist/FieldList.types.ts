import { type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { type ClassName } from "../types.ts";

export type FieldSize = "fit" | "fill" | "fillAlt";

export type FieldGrow = 1 | 2 | 3 | 4 | 5;

export type FieldListProps = {
  readonly as?: ElementType<HTMLAttributes<HTMLElement>>;
  readonly className?: ClassName;
  readonly id?: string;
  readonly title?: string;
  readonly children?: ReactNode;
};

export type FieldProps = {
  readonly size?: FieldSize;
  readonly grow?: FieldGrow;
  readonly as?: ElementType<HTMLAttributes<HTMLElement>>;
  readonly className?: ClassName;
  readonly id?: string;
  readonly title?: string;
  readonly children?: ReactNode;
};
