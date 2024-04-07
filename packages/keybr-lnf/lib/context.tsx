import { createContext, useContext } from "react";
import { type ThemeControl } from "./types.ts";

export const ThemeContext = createContext<ThemeControl>({
  fullscreenState: null,
  color: "light",
  font: "opensans",
  toggleFullscreen: (): void => {},
  switchColor: (): void => {},
  switchFont: (): void => {},
});

export function useTheme(): ThemeControl {
  return useContext(ThemeContext);
}
