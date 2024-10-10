import { type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { type SizeName } from "../../styles/index.ts";

export type FieldListProps = {
  readonly as?: ElementType<HTMLAttributes<HTMLElement>>;
  readonly children?: ReactNode;
  readonly title?: string;
};

export type FieldProps = {
  readonly as?: ElementType<HTMLAttributes<HTMLElement>>;
  readonly children?: ReactNode;
  readonly size?: SizeName;
  readonly title?: string;
};
