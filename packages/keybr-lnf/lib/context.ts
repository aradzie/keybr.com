import { createContext, useContext } from "react";
import { COLORS, FONTS } from "./themes.ts";

export type ThemeControl = {
  readonly fullscreenState: boolean | null;
  readonly color: string;
  readonly font: string;
  readonly toggleFullscreen: () => void;
  readonly switchColor: (color: string) => void;
  readonly switchFont: (font: string) => void;
};

export const ThemeContext = createContext<ThemeControl>({
  fullscreenState: null,
  color: COLORS.default.id,
  font: FONTS.default.id,
  toggleFullscreen: () => {},
  switchColor: () => {},
  switchFont: () => {},
});

export function useTheme(): ThemeControl {
  return useContext(ThemeContext);
}
