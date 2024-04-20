import { type ReactElement, type ReactNode } from "react";
import { type FocusProps } from "../props.ts";
import { type ClassName } from "../types.ts";

export type TabListProps = {
  readonly className?: ClassName;
  readonly children?: readonly ReactElement<TabProps>[];
  readonly selectedIndex?: number;
  readonly onSelect?: (selectedIndex: number) => void;
} & FocusProps;

export type TabProps = {
  readonly children?: ReactNode;
  readonly label: ReactNode;
  readonly title?: string;
};
