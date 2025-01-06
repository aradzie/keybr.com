import { createContext, useContext } from "react";
import { type FlyoutContextType } from "./Flyout.types.ts";

export const FlyoutContext = createContext<FlyoutContextType>({
  anchorRef: { current: null },
  open: false,
  setOpen: () => {},
});

export function useFlyout() {
  return useContext(FlyoutContext);
}
