import { type ReactNode } from "react";

export type DialogProps = {
  readonly children: ReactNode;
  readonly onClose?: () => void;
};
