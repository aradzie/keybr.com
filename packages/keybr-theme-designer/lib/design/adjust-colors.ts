import { Color } from "@keybr/color";
import { type CustomTheme } from "@keybr/themes";

export function adjustColors(
  theme: CustomTheme,
  property: "saturation" | "brightness",
  delta: number,
) {
  for (let [prop, value] of theme) {
    if (value instanceof Color) {
      switch (property) {
        case "saturation":
          value = value.saturate(delta);
          break;
        case "brightness":
          value = value.lighten(delta);
          break;
      }
      theme = theme.set(prop, value);
    }
  }
  return theme;
}
