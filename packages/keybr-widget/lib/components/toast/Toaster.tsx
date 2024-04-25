import {
  cloneElement,
  isValidElement,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { createRoot, type Root } from "react-dom/client";
import { toastProps, ToastProvider, useToast } from "./context.tsx";
import { state, Toast } from "./state.ts";
import * as styles from "./Toaster.module.less";
import { type ToastOptions } from "./types.ts";

function Toaster(): ReactNode {
  const [toasts, setToasts] = useState(state.toasts);
  useEffect(() => state.listen(setToasts), [toasts]);
  return (
    <>
      {toasts.map((toast, index) => (
        <ToastProvider key={index} toast={toast}>
          <Wrapper>{toast.message}</Wrapper>
        </ToastProvider>
      ))}
    </>
  );
}

function Wrapper({ children }: { readonly children: ReactNode }): ReactNode {
  const toast = useToast();
  const props = toastProps(toast);
  if (isValidElement(children)) {
    return cloneElement(children, { ...children.props, ...props });
  } else {
    return <div {...props}>{children}</div>;
  }
}

namespace Toaster {
  let root: Root | null = null;

  export function getRoot(): Root {
    if (root == null) {
      const el = document.createElement("div");
      el.className = styles.toaster;
      root = createRoot(el);
      const parent = document.body;
      parent.appendChild(el);
      state.listen((toasts) => {
        if (toasts.length > 0) {
          if (el.parentElement !== parent) {
            parent.appendChild(el);
          }
        } else {
          if (el.parentElement === parent) {
            parent.removeChild(el);
          }
        }
      });
    }
    return root;
  }
}

export function toast(
  message: ReactNode,
  {
    autoClose = 3000,
    pauseOnHover = true,
    closeOnClick = true,
  }: Partial<ToastOptions> = {},
): void {
  state.add(new Toast(message, { autoClose, pauseOnHover, closeOnClick }));
  Toaster.getRoot().render(<Toaster />);
}
