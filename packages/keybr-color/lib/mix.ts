import { clamp } from "@keybr/lang";
import { RgbColor } from "./color-rgb.ts";
import { rgbGammaToLinear, rgbLinearToGamma } from "./convert-xyz.ts";
import { type Rgb } from "./types.ts";

const u: Rgb = { r: 0, g: 0, b: 0, alpha: 1 };
const v: Rgb = { r: 0, g: 0, b: 0, alpha: 1 };

export function mixColors(
  a: Readonly<Rgb>,
  b: Readonly<Rgb>,
  r: number,
): RgbColor {
  r = clamp(r, 0, 1);
  rgbGammaToLinear(a, u);
  rgbGammaToLinear(b, v);
  u.r = (v.r - u.r) * r + u.r;
  u.g = (v.g - u.g) * r + u.g;
  u.b = (v.b - u.b) * r + u.b;
  u.alpha = (v.alpha - u.alpha) * r + u.alpha;
  rgbLinearToGamma(u, v);
  return new RgbColor(v.r, v.g, v.b, v.alpha);
}
