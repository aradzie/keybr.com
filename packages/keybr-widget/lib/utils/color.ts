import { isNumber, isObjectLike } from "@keybr/lang";

/** A color with Red, Green, Blue and Alpha components. */
export type TRgb = {
  /** The red component, a number in range [0,1]. */
  r: number;
  /** The green component, a number in range [0,1]. */
  g: number;
  /** The blue component, a number in range [0,1]. */
  b: number;
  /** The alpha component, a number in range [0,1]. */
  a: number;
};

/** A color with Hue, Saturation, Lightness and Alpha components. */
export type THsl = {
  /** The hue component, a number in range [0,1]. */
  h: number;
  /** The saturation component, a number in range [0,1]. */
  s: number;
  /** The lightness component, a number in range [0,1]. */
  l: number;
  /** The alpha component, a number in range [0,1]. */
  a: number;
};

/** Matches hex string "#RGB". */
const RE_HEX_RGB = /^#([a-z0-9]{1})([a-z0-9]{1})([a-z0-9]{1})$/i;
/** Matches hex string "#RRGGBB". */
const RE_HEX_RRGGBB = /^#([a-z0-9]{2})([a-z0-9]{2})([a-z0-9]{2})$/i;
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

/** Base abstract color class. */
export abstract class Color {
  static parse(value: string): Color {
    let m: RegExpMatchArray | null;
    if ((m = value.match(RE_HEX_RGB))) {
      const r = parseInt(m[1], 16);
      const g = parseInt(m[2], 16);
      const b = parseInt(m[3], 16);
      return new RgbColor(
        ((r << 4) | r) / 255,
        ((g << 4) | g) / 255,
        ((b << 4) | b) / 255,
        1,
      );
    }
    if ((m = value.match(RE_HEX_RRGGBB))) {
      const r = parseInt(m[1], 16) / 255;
      const g = parseInt(m[2], 16) / 255;
      const b = parseInt(m[3], 16) / 255;
      return new RgbColor(r, g, b, 1);
    }
    if ((m = value.match(RE_RGB))) {
      const r = parseColor(m[1]);
      const g = parseColor(m[2]);
      const b = parseColor(m[3]);
      return new RgbColor(r, g, b, 1);
    }
    if ((m = value.match(RE_RGBA))) {
      const r = parseColor(m[1]);
      const g = parseColor(m[2]);
      const b = parseColor(m[3]);
      const a = parseAlpha(m[4]);
      return new RgbColor(r, g, b, a);
    }
    if ((m = value.match(RE_HSL))) {
      const h = parseAngle(m[1]);
      const s = parseAlpha(m[2]);
      const l = parseAlpha(m[3]);
      return new HslColor(h, s, l, 1);
    }
    if ((m = value.match(RE_HSLA))) {
      const h = parseAngle(m[1]);
      const s = parseAlpha(m[2]);
      const l = parseAlpha(m[3]);
      const a = parseAlpha(m[4]);
      return new HslColor(h, s, l, a);
    }
    throw new TypeError();
  }

  /**
   * Convert to the RGB model.
   * @param clone Whether to make a new clone if already is RGB. Otherwise return this.
   * @return Color in the RGB model.
   */
  abstract toRgb(clone?: boolean): RgbColor;

  /**
   * Convert to the HSL model.
   * @param clone Whether to make a new clone if already is HSL. Otherwise return this.
   * @return Color in the HSL model.
   */
  abstract toHsl(clone?: boolean): HslColor;

  luminance(): number {
    const { r, g, b, a } = this.toRgb();
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) * a;
  }

  saturate(v: number): HslColor {
    const hsl = this.toHsl(true);
    hsl.s = clamp(hsl.s + v, 0, 1);
    return hsl;
  }

  desaturate(v: number): HslColor {
    const hsl = this.toHsl(true);
    hsl.s = clamp(hsl.s - v, 0, 1);
    return hsl;
  }

  lighten(v: number): HslColor {
    const hsl = this.toHsl(true);
    hsl.l = clamp(hsl.l + v, 0, 1);
    return hsl;
  }

  darken(v: number): HslColor {
    const hsl = this.toHsl(true);
    hsl.l = clamp(hsl.l - v, 0, 1);
    return hsl;
  }

  fadeIn(v: number): HslColor {
    const hsl = this.toHsl(true);
    hsl.a = clamp(hsl.a + v, 0, 1);
    return hsl;
  }

  fadeOut(v: number): HslColor {
    const hsl = this.toHsl(true);
    hsl.a = clamp(hsl.a - v, 0, 1);
    return hsl;
  }

  fade(v: number): HslColor {
    const hsl = this.toHsl(true);
    hsl.a = clamp(v, 0, 1);
    return hsl;
  }

  spin(v: number): HslColor {
    const hsl = this.toHsl(true);
    let h = hsl.h + v;
    if (h < 0) {
      h = -(h - Math.ceil(h));
    }
    if (h > 1) {
      h = h - Math.floor(h);
    }
    hsl.h = h;
    return hsl;
  }

  abstract format(): string;

  toString(): string {
    return this.format();
  }

  /**
   * Get RGB color from hex number with RGB components.
   * @param hex A number with RGB components.
   * @return An RGB color instance.
   */
  static rgb(hex: number): RgbColor {
    const r = (hex >>> 16) & 0xff;
    const g = (hex >>> 8) & 0xff;
    const b = hex & 0xff;
    return new RgbColor(r / 255, g / 255, b / 255);
  }
}

/**
 * A color in the RGB model.
 */
export class RgbColor extends Color implements TRgb {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number, g: number, b: number, a?: number);
  constructor(value: Readonly<TRgb>);
  constructor(...args: any[]) {
    super();
    const l = args.length;
    if (
      l === 3 &&
      isNumber(args[0]) &&
      isNumber(args[1]) &&
      isNumber(args[2])
    ) {
      this.r = clamp(args[0], 0, 1);
      this.g = clamp(args[1], 0, 1);
      this.b = clamp(args[2], 0, 1);
      this.a = 1;
      return this;
    }
    if (
      l === 4 &&
      isNumber(args[0]) &&
      isNumber(args[1]) &&
      isNumber(args[2]) &&
      isNumber(args[3])
    ) {
      this.r = clamp(args[0], 0, 1);
      this.g = clamp(args[1], 0, 1);
      this.b = clamp(args[2], 0, 1);
      this.a = clamp(args[3], 0, 1);
      return this;
    }
    const [value] = args;
    if (l === 1 && RgbColor.isColor(value)) {
      this.r = clamp(value.r, 0, 1);
      this.g = clamp(value.g, 0, 1);
      this.b = clamp(value.b, 0, 1);
      this.a = clamp(value.a, 0, 1);
      return this;
    }
    throw new TypeError();
  }

  override toRgb(clone?: boolean): RgbColor {
    if (clone) {
      return new RgbColor(this);
    }
    return this;
  }

  override toHsl(): HslColor {
    const { r, g, b, a } = this;
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

  override format(): string {
    const r = Math.round(this.r * 255);
    const g = Math.round(this.g * 255);
    const b = Math.round(this.b * 255);
    const a = this.a;
    if (a !== 1) {
      return `rgba(${[r, g, b, a].join(",")})`;
    } else {
      return `rgb(${[r, g, b].join(",")})`;
    }
  }

  formatHex(): string {
    const r = Math.round(this.r * 255);
    const g = Math.round(this.g * 255);
    const b = Math.round(this.b * 255);
    return `#${(pad0(r) + pad0(g) + pad0(b)).toUpperCase()}`;
  }

  static between(a: Readonly<TRgb>, b: Readonly<TRgb>, n: number): RgbColor {
    return new RgbColor(
      (b.r - a.r) * n + a.r,
      (b.g - a.g) * n + a.g,
      (b.b - a.b) * n + a.b,
    );
  }

  static isColor(o: any): o is TRgb {
    return (
      isObjectLike(o) &&
      isNumber(o.r) &&
      isNumber(o.g) &&
      isNumber(o.b) &&
      (o.a == null || isNumber(o.a))
    );
  }
}

/**
 * A color in the HSL model.
 */
export class HslColor extends Color implements THsl {
  h: number;
  s: number;
  l: number;
  a: number;

  constructor(h: number, s: number, l: number, a?: number);
  constructor(value: Readonly<THsl>);
  constructor(...args: any[]) {
    super();
    const l = args.length;
    if (
      l === 3 &&
      isNumber(args[0]) &&
      isNumber(args[1]) &&
      isNumber(args[2])
    ) {
      this.h = clamp(args[0], 0, 1);
      this.s = clamp(args[1], 0, 1);
      this.l = clamp(args[2], 0, 1);
      this.a = 1;
      return this;
    }
    if (
      l === 4 &&
      isNumber(args[0]) &&
      isNumber(args[1]) &&
      isNumber(args[2]) &&
      isNumber(args[3])
    ) {
      this.h = clamp(args[0], 0, 1);
      this.s = clamp(args[1], 0, 1);
      this.l = clamp(args[2], 0, 1);
      this.a = clamp(args[3], 0, 1);
      return this;
    }
    const [value] = args;
    if (l === 1 && HslColor.isColor(value)) {
      this.h = clamp(value.h, 0, 1);
      this.s = clamp(value.s, 0, 1);
      this.l = clamp(value.l, 0, 1);
      this.a = clamp(value.a, 0, 1);
      return this;
    }
    throw new TypeError();
  }

  override toRgb(): RgbColor {
    const { h, s, l, a } = this;
    const t2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
    const t1 = l * 2 - t2;
    const r = hueToRgb(t1, t2, h + 1 / 3);
    const g = hueToRgb(t1, t2, h);
    const b = hueToRgb(t1, t2, h - 1 / 3);
    return new RgbColor(r, g, b, a);
  }

  override toHsl(clone?: boolean): HslColor {
    if (clone) {
      return new HslColor(this);
    }
    return this;
  }

  override format(): string {
    const h = Math.round(this.h * 360);
    const s = Math.round(this.s * 100);
    const l = Math.round(this.l * 100);
    const a = this.a;
    if (isNumber(a) && a !== 1) {
      return `hsla(${[h, s + "%", l + "%", a].join(",")})`;
    } else {
      return `hsl(${[h, s + "%", l + "%"].join(",")})`;
    }
  }

  static isColor(o: any): o is THsl {
    return (
      isObjectLike(o) &&
      isNumber(o.h) &&
      isNumber(o.s) &&
      isNumber(o.l) &&
      (o.a == null || isNumber(o.a))
    );
  }
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

function parseColor(s: string): number {
  if (s.endsWith("%")) {
    return clamp(parseNumber(s.substring(0, s.length - 1)) / 100, 0, 1);
  } else {
    return clamp(parseNumber(s) / 255, 0, 1);
  }
}

function parseAngle(s: string): number {
  if (s.endsWith("%")) {
    return clamp(parseNumber(s.substring(0, s.length - 1)) / 100, 0, 1);
  } else {
    return clamp((parseNumber(s) % 360) / 360, 0, 1);
  }
}

function parseAlpha(s: string): number {
  if (s.endsWith("%")) {
    return clamp(parseNumber(s.substring(0, s.length - 1)) / 100, 0, 1);
  } else {
    return clamp(parseNumber(s), 0, 1);
  }
}

function parseNumber(s: string): number {
  const v = parseFloat(s);
  if (isNaN(v)) {
    throw new Error();
  } else {
    return v;
  }
}

function pad0(v: number): string {
  const r = v.toString(16);
  if (v < 16) {
    return "0" + r;
  } else {
    return r;
  }
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(Math.min(v, max), min);
}
