import { TEXT_SIZES, THEMES } from "./options.tsx";
import { type ThemePrefs } from "./prefs.ts";

export function getTextDataValue(prefs: ThemePrefs): string {
  return TEXT_SIZES.findOption(prefs.textSize).id;
}

export function getThemeDataValue(prefs: ThemePrefs): string {
  return THEMES.findOption(prefs.themeName).id;
}
