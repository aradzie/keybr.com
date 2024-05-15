import {
  cloneElement,
  createContext,
  type ReactElement,
  type ReactNode,
  useContext,
} from "react";
import { state, type Toast } from "./state.ts";

export type ToastContextValue = {
  readonly close: () => void;
  readonly hover: (over: boolean) => void;
  readonly click: () => void;
};

export const ToastContext = createContext<ToastContextValue>(null!);

export function ToastProvider({
  toast,
  children,
}: {
  readonly toast: Toast;
  readonly children: ReactNode;
}): ReactNode {
  return (
    <ToastContext.Provider
      value={{
        close: () => {
          state.close(toast);
        },
        hover: (over) => {
          if (toast.options.autoClose && toast.options.pauseOnHover) {
            state.retain(toast, over);
          }
        },
        click: () => {
          if (toast.options.closeOnClick) {
            state.close(toast);
          }
        },
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (value == null) {
    throw new Error(
      process.env.NODE_ENV !== "production"
        ? "ToastContext is missing"
        : undefined,
    );
  }
  return value;
}

export function toastProps(toast: ToastContextValue) {
  return {
    onMouseOver: () => {
      toast.hover(true);
    },
    onMouseOut: () => {
      toast.hover(false);
    },
    onClick: () => {
      toast.click();
    },
  };
}

export function ToastWrapper({
  children,
}: {
  readonly children: ReactElement;
}): ReactNode {
  return cloneElement(children, {
    ...children.props,
    ...toastProps(useToast()),
  });
}
