import { type ReactNode } from "react";
import { Backdrop } from "../popup/index.ts";
import { Portal } from "../portal/index.ts";
import { DialogContext } from "./context.ts";
import * as styles from "./Dialog.module.less";
import { type DialogProps } from "./Dialog.types.ts";

export function Dialog({ children, onClose }: DialogProps): ReactNode {
  return (
    <Portal>
      <Backdrop>
        <div className={styles.root}>
          <div className={styles.content}>
            <DialogContext.Provider
              value={{
                closeDialog: () => {
                  onClose?.();
                },
              }}
            >
              {children}
            </DialogContext.Provider>
          </div>
        </div>
      </Backdrop>
    </Portal>
  );
}
