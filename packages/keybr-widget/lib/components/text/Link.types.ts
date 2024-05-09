import { type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { type ClassName, type MouseProps } from "../types.ts";

export type LinkProps = {
  readonly as?: ElementType<HTMLAttributes<HTMLAnchorElement>>;
  readonly className?: ClassName;
  readonly id?: string;
  readonly href?: string;
  readonly target?: string;
  readonly download?: string;
  readonly external?: boolean;
  readonly title?: string;
  readonly children?: ReactNode;
} & MouseProps;
