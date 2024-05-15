import { type ReactElement, type ReactNode, useEffect, useState } from "react";
import { ToastProvider, ToastWrapper } from "./context.tsx";
import { state, Toast } from "./state.ts";
import * as styles from "./Toaster.module.less";
import { type ToastOptions } from "./types.ts";

export function Toaster(): ReactNode {
  const [toasts, setToasts] = useState(state.toasts);
  useEffect(() => state.listen(setToasts), [toasts]);
  return (
    <div className={styles.toaster}>
      {[...toasts].reverse().map((toast) => (
        <ToastProvider key={toast.key} toast={toast}>
          <ToastWrapper>{toast.message}</ToastWrapper>
        </ToastProvider>
      ))}
    </div>
  );
}

export function toast(
  message: ReactElement,
  {
    autoClose = 3000,
    pauseOnHover = true,
    closeOnClick = true,
  }: Partial<ToastOptions> = {},
): void {
  state.add(new Toast(message, { autoClose, pauseOnHover, closeOnClick }));
}
