import { HslColor } from "./color-hsl.ts";
import { HsvColor } from "./color-hsv.ts";
import { HwbColor } from "./color-hwb.ts";
import { RgbColor } from "./color-rgb.ts";
import { type Hsl, type Hsv, type Hwb, type Rgb } from "./types.ts";

export function rgbToHsl({ r, g, b, alpha }: Readonly<Rgb>): HslColor {
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
  return new HslColor(h, s, l, alpha);
}

export function hslToRgb({ h, s, l, alpha }: Readonly<Hsl>): RgbColor {
  const t2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
  const t1 = l * 2 - t2;
  const r = hueToRgb(t1, t2, h + 1 / 3);
  const g = hueToRgb(t1, t2, h);
  const b = hueToRgb(t1, t2, h - 1 / 3);
  return new RgbColor(r, g, b, alpha);
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

export function hslToHsv({ h, s, l, alpha }: Readonly<Hsl>): HsvColor {
  const vv = l + s * Math.min(l, 1 - l);
  const ss = vv > 0 ? 2 * (1 - l / vv) : 0;
  return new HsvColor(h, ss, vv, alpha);
}

export function hsvToHsl({ h, s, v, alpha }: Readonly<Hsv>): HslColor {
  const ll = v * (1 - s / 2);
  const ss = ll > 0 && ll < 1 ? (v - ll) / Math.min(ll, 1 - ll) : 0;
  return new HslColor(h, ss, ll, alpha);
}

export function hwbToRgb({ h, w, b, alpha }: Readonly<Hwb>): RgbColor {
  if (w + b >= 1) {
    const gray = w / (w + b);
    return new RgbColor(gray, gray, gray, alpha);
  } else {
    const rr = hueToRgb(0, 1, h + 1 / 3) * (1 - w - b) + w;
    const gg = hueToRgb(0, 1, h) * (1 - w - b) + w;
    const bb = hueToRgb(0, 1, h - 1 / 3) * (1 - w - b) + w;
    return new RgbColor(rr, gg, bb, alpha);
  }
}

export function rgbToHwb({ r, g, b, alpha }: Readonly<Rgb>): HwbColor {
  // RGB to HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d > 0) {
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
  // HSL to HWB
  const ww = min;
  const bb = 1 - max;
  return new HwbColor(h, ww, bb, alpha);
}

export function hwbToHsl({ h, w, b, alpha }: Readonly<Hwb>): HslColor {
  // HWB to HSV
  const v = 1 - b;
  const s = v > 0 ? 1 - w / v : 0;
  // HSV to HSL
  const ll = v * (1 - s / 2);
  const ss = ll > 0 && ll < 1 ? (v - ll) / Math.min(ll, 1 - ll) : 0;
  return new HslColor(h, ss, ll, alpha);
}

export function hslToHwb({ h, s, l, alpha }: Readonly<Hsl>): HwbColor {
  // HSL to HSV
  const vv = l + s * Math.min(l, 1 - l);
  const ss = vv > 0 ? 2 * (1 - l / vv) : 0;
  // HSV to HWB
  const ww = (1 - ss) * vv;
  const bb = 1 - vv;
  return new HwbColor(h, ww, bb, alpha);
}

export function hwbToHsv({ h, w, b, alpha }: Readonly<Hwb>): HsvColor {
  const vv = 1 - b;
  const ss = vv > 0 ? 1 - w / vv : 0;
  return new HsvColor(h, ss, vv, alpha);
}

export function hsvToHwb({ h, s, v, alpha }: Readonly<Hsv>): HwbColor {
  const ww = (1 - s) * v;
  const bb = 1 - v;
  return new HwbColor(h, ww, bb, alpha);
}
