import { type ReactElement, useRef, useState } from "react";
import { type Anchor } from "../../floating/index.ts";
import { FlyoutContext } from "./Flyout.context.ts";
import { type FlyoutProps } from "./Flyout.types.ts";
import { FlyoutContent } from "./FlyoutContent.tsx";
import { FlyoutTrigger } from "./FlyoutTrigger.tsx";

function Flyout({
  children,
  disabled = false,
  onClose,
  onOpen,
}: FlyoutProps): ReactElement {
  const anchorRef = useRef<Anchor>(null);
  const [open, setOpen] = useState(false);
  // useOnClickOutside([], () => {
  //   setOpen(false);
  // });
  return (
    <FlyoutContext
      value={{
        anchorRef,
        open,
        setOpen: (open) => {
          if (!disabled) {
            setOpen(open);
            if (open) {
              onOpen?.();
            } else {
              onClose?.();
            }
          }
        },
      }}
    >
      {children}
    </FlyoutContext>
  );
}

Flyout.Trigger = FlyoutTrigger;
Flyout.Content = FlyoutContent;

export { Flyout };
