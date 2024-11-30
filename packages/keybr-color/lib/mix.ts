import { clamp } from "@keybr/lang";
import { type Color } from "./color.ts";
import { type RgbColor } from "./color-rgb.ts";
import { oklabToRgb, rgbToOklab0 } from "./convert-xyz.ts";
import { type Oklab } from "./types.ts";

const u: Oklab = { l: 0, a: 0, b: 0, alpha: 1 };
const v: Oklab = { l: 0, a: 0, b: 0, alpha: 1 };

export function mixColors(a: Color, b: Color, ratio: number): RgbColor {
  ratio = clamp(ratio, 0, 1);
  rgbToOklab0(a.toRgb(), u);
  rgbToOklab0(b.toRgb(), v);
  u.l = u.l * (1 - ratio) + v.l * ratio;
  u.a = u.a * (1 - ratio) + v.a * ratio;
  u.b = u.b * (1 - ratio) + v.b * ratio;
  u.alpha = u.alpha * (1 - ratio) + v.alpha * ratio;
  return oklabToRgb(u);
}
