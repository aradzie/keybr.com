import { createContext, useContext } from "react";
import { type ThemePrefs } from "./prefs.ts";
import { COLORS, FONTS } from "./themes.ts";

export type ThemeValue = {
  readonly fullscreenState: boolean | null;
  readonly color: string;
  readonly font: string;
  readonly hash: number;
  readonly toggleFullscreen: () => void;
  readonly switchColor: (id: string) => void;
  readonly switchFont: (id: string) => void;
  readonly refresh: () => void;
};

export const ThemeContext = createContext<ThemeValue>({
  fullscreenState: null,
  color: COLORS.default.id,
  font: FONTS.default.id,
  hash: 0,
  toggleFullscreen: () => {},
  switchColor: () => {},
  switchFont: () => {},
  refresh: () => {},
});

export function useTheme(): ThemeValue {
  return useContext(ThemeContext);
}

export function staticTheme(
  { color, font }: ThemePrefs,
  hash: number = 0,
): ThemeValue {
  return {
    fullscreenState: null,
    color,
    font,
    hash,
    toggleFullscreen: () => {},
    switchColor: () => {},
    switchFont: () => {},
    refresh: () => {},
  };
}
