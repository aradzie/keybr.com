import { type CustomTheme, customTheme } from "@keybr/themes";
import { createContext, useContext } from "react";

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
