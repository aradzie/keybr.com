import { COLORS, FONTS } from "./themes.ts";

export class ThemePrefs {
  static colorAttrName = "data-color";
  static fontAttrName = "data-font";
  static cookieKey = "prefs";

  static dataAttributes({ color, font }: ThemePrefs) {
    return {
      [ThemePrefs.colorAttrName]: COLORS.find(color).id,
      [ThemePrefs.fontAttrName]: FONTS.find(font).id,
    };
  }

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

  readonly color: string;
  readonly font: string;

  constructor(o: unknown) {
    const { color, font } = Object(o);
    this.color = COLORS.find(String(color)).id;
    this.font = FONTS.find(String(font)).id;
  }
}
