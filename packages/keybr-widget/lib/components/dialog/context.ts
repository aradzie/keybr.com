import { createContext, useContext } from "react";

export const DialogContext = createContext({ closeDialog: () => {} });

export function useDialog() {
  const value = useContext(DialogContext);
  if (value == null) {
    throw new Error(
      process.env.NODE_ENV !== "production"
        ? "DialogContext is missing"
        : undefined,
    );
  }
  return value;
}
