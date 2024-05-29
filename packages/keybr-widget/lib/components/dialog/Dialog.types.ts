import { type ReactElement, type ReactNode } from "react";
import { type IconProps } from "../icon/index.ts";
import { type ClassName } from "../types.ts";

export type Action = {
  readonly action: () => void;
  readonly autoFocus?: boolean;
  readonly icon?: ReactElement<IconProps>;
  readonly label: ReactNode;
  readonly title?: string;
};

export type DialogProps = {
  readonly actions?: Action[];
  readonly children: ReactNode;
  readonly className?: ClassName;
  readonly onCancel?: () => void;
  readonly onClose?: () => void;
};
