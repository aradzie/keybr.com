import { type ReactNode } from "react";
import { type ClassName, type FocusProps } from "../types.ts";

export type OptionListOption = {
  readonly value: string;
  readonly name: ReactNode;
};

export type OptionListProps = {
  readonly className?: ClassName;
  readonly options: readonly OptionListOption[];
  readonly title?: string;
  readonly value: string;
  readonly onSelect?: (value: string) => void;
} & FocusProps;
