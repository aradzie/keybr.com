import { clamp, isNumber, isObjectLike } from "@keybr/lang";
import { Color } from "./color.ts";
import { hslToHsv, rgbToHsl } from "./convert.ts";
import { type Rgb } from "./types.ts";

/**
 * A color in the RGB model.
 */
export class RgbColor extends Color implements Rgb {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number, g: number, b: number, a?: number);
  constructor(value: Readonly<{ r: number; g: number; b: number; a?: number }>);
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
    if (l === 1 && RgbColor.is(value)) {
      this.r = clamp(value.r, 0, 1);
      this.g = clamp(value.g, 0, 1);
      this.b = clamp(value.b, 0, 1);
      this.a = clamp(value.a ?? 1, 0, 1);
      return this;
    }
    throw new TypeError();
  }

  override toRgb(clone?: boolean) {
    if (clone) {
      return new RgbColor(this);
    }
    return this;
  }

  override toHsl() {
    return rgbToHsl(this);
  }

  override toHsv() {
    return hslToHsv(rgbToHsl(this));
  }

  override format() {
    const r = Math.round(this.r * 255);
    const g = Math.round(this.g * 255);
    const b = Math.round(this.b * 255);
    const a = this.a;
    if (a < 1) {
      return `rgb(${r} ${g} ${b}/${a})`;
    } else {
      return `rgb(${r} ${g} ${b})`;
    }
  }

  formatHex(): string {
    const r = Math.round(this.r * 255);
    const g = Math.round(this.g * 255);
    const b = Math.round(this.b * 255);
    const a = Math.round(this.a * 255);
    if (a < 255) {
      return `#${pad0(r) + pad0(g) + pad0(b) + pad0(a)}`;
    } else {
      return `#${pad0(r) + pad0(g) + pad0(b)}`;
    }
  }

  hex(): number {
    const r = Math.round(this.r * 255);
    const g = Math.round(this.g * 255);
    const b = Math.round(this.b * 255);
    return (r << 16) | (g << 8) | (b << 0);
  }

  static is(o: any): o is Rgb {
    return (
      isObjectLike(o) &&
      isNumber(o.r) &&
      isNumber(o.g) &&
      isNumber(o.b) &&
      (o.a == null || isNumber(o.a))
    );
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
