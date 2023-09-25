import { createContext, useContext } from "react";
import { type ThemeControl } from "./types.ts";

export const ThemeContext = createContext<ThemeControl>({
  fullscreenState: null,
  themeName: "light",
  textSize: "normal",
  toggleFullscreen: (): void => {},
  switchTheme: (): void => {},
  switchTextSize: (): void => {},
});

export function useTheme(): ThemeControl {
  return useContext(ThemeContext);
}
