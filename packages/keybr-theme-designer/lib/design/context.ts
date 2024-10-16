import { type CustomTheme, defaultCustomTheme } from "@keybr/themes";
import { createContext, useContext } from "react";

export type CustomThemeValue = {
  readonly theme: CustomTheme;
  readonly setTheme: (theme: CustomTheme) => void;
};

export const CustomThemeContext = createContext<CustomThemeValue>({
  theme: defaultCustomTheme,
  setTheme: () => {},
});

export function useCustomTheme(): CustomThemeValue {
  return useContext(CustomThemeContext);
}
