import { type TextSize, type ThemeName } from "./types.ts";

export class ThemePrefs {
  static cookieKey = "prefs";

  static serialize(prefs: ThemePrefs): string {
    return JSON.stringify(prefs);
  }

  static deserialize(value: unknown): ThemePrefs {
    let o = null;
    if (typeof value === "string") {
      try {
        o = JSON.parse(value);
      } catch {
        // Ignore.
      }
    }
    return new ThemePrefs(o);
  }

  readonly themeName: ThemeName;
  readonly textSize: TextSize;

  constructor(o: unknown) {
    let { themeName, textSize }: ThemePrefs = Object(o);
    switch (themeName) {
      case "light":
      case "dark":
        break;
      default:
        themeName = "light";
        break;
    }
    switch (textSize) {
      case "normal":
      case "large":
      case "huge":
        break;
      default:
        textSize = "normal";
    }
    this.themeName = themeName;
    this.textSize = textSize;
  }
}
