import { type ReactNode } from "react";

export type DialogProps = {
  readonly backdrop?: boolean;
  readonly children: ReactNode;
  readonly onClose?: () => void;
};
