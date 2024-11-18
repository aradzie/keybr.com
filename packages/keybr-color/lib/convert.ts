import { clamp } from "@keybr/lang";
import { HslColor } from "./color-hsl.ts";
import { HsvColor } from "./color-hsv.ts";
import { RgbColor } from "./color-rgb.ts";
import { type Hsl, type Hsv, type Rgb } from "./types.ts";

export function rgbToHsl({ r, g, b, a }: Rgb): HslColor {
  r = clamp(r, 0, 1);
  g = clamp(g, 0, 1);
  b = clamp(b, 0, 1);
  a = clamp(a, 0, 1);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (d > 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return new HslColor(h, s, l, a);
}

export function hslToRgb({ h, s, l, a }: Hsl): RgbColor {
  h = clamp(h, 0, 1);
  s = clamp(s, 0, 1);
  l = clamp(l, 0, 1);
  a = clamp(a, 0, 1);
  const t2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
  const t1 = l * 2 - t2;
  const r = hueToRgb(t1, t2, h + 1 / 3);
  const g = hueToRgb(t1, t2, h);
  const b = hueToRgb(t1, t2, h - 1 / 3);
  return new RgbColor(r, g, b, a);
}

function hueToRgb(m1: number, m2: number, h: number): number {
  h = h < 0 ? h + 1 : h > 1 ? h - 1 : h;
  if (h * 6 < 1) {
    return m1 + (m2 - m1) * h * 6;
  }
  if (h * 2 < 1) {
    return m2;
  }
  if (h * 3 < 2) {
    return m1 + (m2 - m1) * (2 / 3 - h) * 6;
  }
  return m1;
}

export function hslToHsv({ h, s, l, a }: Hsl): HsvColor {
  h = clamp(h, 0, 1);
  s = clamp(s, 0, 1);
  l = clamp(l, 0, 1);
  a = clamp(a, 0, 1);
  const vv = l + s * Math.min(l, 1 - l);
  const ss = vv > 0 ? 2 * (1 - l / vv) : 0;
  return new HsvColor(h, ss, vv, a);
}

export function hsvToHsl({ h, s, v, a }: Hsv): HslColor {
  h = clamp(h, 0, 1);
  s = clamp(s, 0, 1);
  v = clamp(v, 0, 1);
  a = clamp(a, 0, 1);
  const ll = v * (1 - s / 2);
  const ss = ll > 0 && ll < 1 ? (v - ll) / Math.min(ll, 1 - ll) : 0;
  return new HslColor(h, ss, ll, a);
}

export function hsvToRgb(hsv: Hsv): RgbColor {
  return hslToRgb(hsvToHsl(hsv));
}

export function rgbToHsv(rgb: Rgb): HsvColor {
  return hslToHsv(rgbToHsl(rgb));
}
