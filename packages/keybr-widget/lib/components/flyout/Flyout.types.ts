import { type ReactElement, type RefObject } from "react";
import { type Anchor } from "../../floating/index.ts";

export type FlyoutProps = {
  readonly children: ReactElement[];
  readonly disabled?: boolean;
  readonly onClose?: () => void;
  readonly onOpen?: () => void;
};

export type FlyoutContextType = {
  readonly anchorRef: RefObject<Anchor | null>;
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
};
