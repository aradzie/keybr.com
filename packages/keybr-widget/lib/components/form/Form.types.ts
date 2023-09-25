import { type ReactNode } from "react";
import { type ClassName } from "../types.ts";

export type FormProps = {
  readonly className?: ClassName;
  readonly id?: string;
  readonly title?: string;
  readonly children: ReactNode;
};

export type FieldSetProps = {
  readonly className?: ClassName;
  readonly id?: string;
  readonly disabled?: boolean;
  readonly legend?: ReactNode;
  readonly title?: string;
  readonly children: ReactNode;
};

export type LegendProps = {
  readonly className?: ClassName;
  readonly id?: string;
  readonly title?: string;
  readonly children: ReactNode;
};
