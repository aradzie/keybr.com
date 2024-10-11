import { createContext, useContext } from "react";
import { type ThemePrefs } from "./prefs.ts";
import { COLORS, FONTS } from "./themes.ts";

export type ThemeValue = {
  readonly fullscreenState: boolean | null;
  readonly color: string;
  readonly font: string;
  readonly toggleFullscreen: () => void;
  readonly switchColor: (color: string) => void;
  readonly switchFont: (font: string) => void;
};

export const ThemeContext = createContext<ThemeValue>({
  fullscreenState: null,
  color: COLORS.default.id,
  font: FONTS.default.id,
  toggleFullscreen: () => {},
  switchColor: () => {},
  switchFont: () => {},
});

export function useTheme(): ThemeValue {
  return useContext(ThemeContext);
}

export function staticTheme({ color, font }: ThemePrefs): ThemeValue {
  return {
    fullscreenState: null,
    color,
    font,
    toggleFullscreen: () => {},
    switchColor: () => {},
    switchFont: () => {},
  };
}
