import { clamp } from "@keybr/lang";
import { type Color } from "./color.ts";
import { HslColor } from "./color-hsl.ts";
import { RgbColor } from "./color-rgb.ts";

/** Matches hex string "#RGB". */
const RE_HEX_RGB = /^#([a-z0-9]{1})([a-z0-9]{1})([a-z0-9]{1})$/i;
/** Matches hex string "#RGBA". */
const RE_HEX_RGBA = /^#([a-z0-9]{1})([a-z0-9]{1})([a-z0-9]{1})([a-z0-9]{1})$/i;
/** Matches hex string "#RRGGBB". */
const RE_HEX_RRGGBB = /^#([a-z0-9]{2})([a-z0-9]{2})([a-z0-9]{2})$/i;
/** Matches hex string "#RRGGBBAA". */
const RE_HEX_RRGGBBAA =
  /^#([a-z0-9]{2})([a-z0-9]{2})([a-z0-9]{2})([a-z0-9]{2})$/i;
/** Matches string "rgb(R,G,B)". */
const RE_RGB =
  /^rgb\(\s*([.0-9]+%?)\s*,\s*([.0-9]+%?)\s*,\s*([.0-9]+%?)\s*\)*$/i;
/** Matches string "rgba(R,G,B,A)". */
const RE_RGBA =
  /^rgba\(\s*([.0-9]+%?)\s*,\s*([.0-9]+%?)\s*,\s*([.0-9]+%?)\s*,\s*([.0-9]+%?)\s*\)*$/i;
/** Matches string "hsl(H,S,L)". */
const RE_HSL =
  /^hsl\(\s*([.0-9]+%?)\s*,\s*([.0-9]+%?)\s*,\s*([.0-9]+%?)\s*\)$/i;
/** Matches string "hsla(H,S,L,A)". */
const RE_HSLA =
  /^hsla\(\s*([.0-9]+%?)\s*,\s*([.0-9]+%?)\s*,\s*([.0-9]+%?)\s*,\s*([.0-9]+%?)\s*\)*$/i;

/**
 * Returns an RGB color from the hex number with RGB components.
 * @param hex A number with RGB components.
 * @return An RGB color instance.
 */
export function hexColor(hex: number): RgbColor {
  const r = (hex >>> 16) & 0xff;
  const g = (hex >>> 8) & 0xff;
  const b = hex & 0xff;
  return new RgbColor(r / 255, g / 255, b / 255);
}

export function tryParseColor(value: string): Color | null {
  try {
    return parseColor(value);
  } catch {
    return null;
  }
}

export function parseColor(value: string): Color {
  let m: RegExpMatchArray | null;
  if ((m = value.match(RE_HEX_RGB))) {
    const r = parseInt(m[1], 16);
    const g = parseInt(m[2], 16);
    const b = parseInt(m[3], 16);
    return new RgbColor(
      ((r << 4) | r) / 255,
      ((g << 4) | g) / 255,
      ((b << 4) | b) / 255,
    );
  }
  if ((m = value.match(RE_HEX_RGBA))) {
    const r = parseInt(m[1], 16);
    const g = parseInt(m[2], 16);
    const b = parseInt(m[3], 16);
    const a = parseInt(m[4], 16);
    return new RgbColor(
      ((r << 4) | r) / 255,
      ((g << 4) | g) / 255,
      ((b << 4) | b) / 255,
      ((a << 4) | a) / 255,
    );
  }
  if ((m = value.match(RE_HEX_RRGGBB))) {
    const r = parseInt(m[1], 16) / 255;
    const g = parseInt(m[2], 16) / 255;
    const b = parseInt(m[3], 16) / 255;
    return new RgbColor(r, g, b);
  }
  if ((m = value.match(RE_HEX_RRGGBBAA))) {
    const r = parseInt(m[1], 16) / 255;
    const g = parseInt(m[2], 16) / 255;
    const b = parseInt(m[3], 16) / 255;
    const a = parseInt(m[4], 16) / 255;
    return new RgbColor(r, g, b, a);
  }
  if ((m = value.match(RE_RGB))) {
    const r = _color(m[1]);
    const g = _color(m[2]);
    const b = _color(m[3]);
    return new RgbColor(r, g, b);
  }
  if ((m = value.match(RE_RGBA))) {
    const r = _color(m[1]);
    const g = _color(m[2]);
    const b = _color(m[3]);
    const a = _alpha(m[4]);
    return new RgbColor(r, g, b, a);
  }
  if ((m = value.match(RE_HSL))) {
    const h = _angle(m[1]);
    const s = _alpha(m[2]);
    const l = _alpha(m[3]);
    return new HslColor(h, s, l);
  }
  if ((m = value.match(RE_HSLA))) {
    const h = _angle(m[1]);
    const s = _alpha(m[2]);
    const l = _alpha(m[3]);
    const a = _alpha(m[4]);
    return new HslColor(h, s, l, a);
  }
  throw new TypeError();
}

function _color(s: string): number {
  if (s.endsWith("%")) {
    return clamp(_number(s.substring(0, s.length - 1)) / 100, 0, 1);
  } else {
    return clamp(_number(s) / 255, 0, 1);
  }
}

function _angle(s: string): number {
  if (s.endsWith("%")) {
    return clamp(_number(s.substring(0, s.length - 1)) / 100, 0, 1);
  } else {
    return clamp((_number(s) % 360) / 360, 0, 1);
  }
}

function _alpha(s: string): number {
  if (s.endsWith("%")) {
    return clamp(_number(s.substring(0, s.length - 1)) / 100, 0, 1);
  } else {
    return clamp(_number(s), 0, 1);
  }
}

function _number(s: string): number {
  const v = parseFloat(s);
  if (isNaN(v)) {
    throw new Error();
  } else {
    return v;
  }
}
