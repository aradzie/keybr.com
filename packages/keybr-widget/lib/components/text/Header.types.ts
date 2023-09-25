import { type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { type ClassName } from "../types.ts";

export type HeaderProps = {
  readonly as?: ElementType<HTMLAttributes<HTMLElement>>;
  readonly level?: 1 | 2 | 3 | 4 | 5;
  readonly className?: ClassName;
  readonly id?: string;
  readonly title?: string;
  readonly children?: ReactNode;
};
