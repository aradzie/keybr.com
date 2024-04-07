import { type ColorName, type FontName } from "./types.ts";

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

  readonly color: ColorName;
  readonly font: FontName;

  constructor(o: unknown) {
    let { color, font }: ThemePrefs = Object(o);
    switch (color) {
      case "light":
      case "dark":
        break;
      default:
        color = "light";
        break;
    }
    switch (font) {
      case "opensans":
      case "spectral":
        break;
      default:
        font = "opensans";
    }
    this.color = color;
    this.font = font;
  }
}
