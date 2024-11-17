import { clamp } from "@keybr/lang";
import { RgbColor } from "./color-rgb.ts";
import { type Rgb } from "./types.ts";

export function mixColors(
  a: Readonly<Rgb>,
  b: Readonly<Rgb>,
  n: number,
): RgbColor {
  n = clamp(n, 0, 1);
  return new RgbColor(
    (b.r - a.r) * n + a.r,
    (b.g - a.g) * n + a.g,
    (b.b - a.b) * n + a.b,
  );
}
