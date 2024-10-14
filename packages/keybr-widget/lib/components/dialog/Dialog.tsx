import { clsx } from "clsx";
import { type ReactNode, useEffect, useRef } from "react";
import { Portal } from "../portal/index.ts";
import { DialogContext } from "./context.ts";
import * as styles from "./Dialog.module.less";
import { type DialogProps } from "./Dialog.types.ts";

export function Dialog({
  backdrop,
  children,
  onClose,
}: DialogProps): ReactNode {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <Portal>
      <dialog
        ref={ref}
        className={clsx(styles.root, backdrop && styles.backdrop)}
      >
        <DialogContext.Provider
          value={{
            closeDialog: () => {
              ref.current?.close();
              onClose?.();
            },
          }}
        >
          {children}
        </DialogContext.Provider>
      </dialog>
    </Portal>
  );
}
