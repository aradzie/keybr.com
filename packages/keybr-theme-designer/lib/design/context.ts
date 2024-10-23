import { type CustomTheme } from "@keybr/themes";
import { createContext, useContext } from "react";
import { customTheme } from "../themes/themes.ts";

export type CustomThemeValue = {
  readonly theme: CustomTheme;
  readonly setTheme: (theme: CustomTheme) => void;
};

export const CustomThemeContext = createContext<CustomThemeValue>({
  theme: customTheme,
  setTheme: () => {},
});

export function useCustomTheme(): CustomThemeValue {
  return useContext(CustomThemeContext);
}
