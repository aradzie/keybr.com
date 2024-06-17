import { type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { type ClassName } from "../types.ts";

export type DescriptionProps = {
  readonly as?: ElementType<HTMLAttributes<HTMLElement>>;
  readonly className?: ClassName;
  readonly id?: string;
  readonly title?: string;
  readonly children?: ReactNode;
};
