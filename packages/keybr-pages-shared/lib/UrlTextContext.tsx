import { createContext, useContext } from "react";

export const UrlTextContext = createContext<string | null>(null);

export function useUrlText(): string | null {
  return useContext(UrlTextContext);
}
