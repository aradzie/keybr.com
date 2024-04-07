import { COLORS, FONTS } from "./options.tsx";
import { type ThemePrefs } from "./prefs.ts";

export function getColorDataValue(prefs: ThemePrefs): string {
  return COLORS.findOption(prefs.color).id;
}

export function getFontDataValue(prefs: ThemePrefs): string {
  return FONTS.findOption(prefs.font).id;
}
