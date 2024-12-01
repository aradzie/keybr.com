import { clamp, isNumber, isObjectLike, round } from "@keybr/lang";
import { Color } from "./color.ts";
import { hslToHsv, rgbToHsl } from "./convert-rgb.ts";
import { type Rgb } from "./types.ts";

/**
 * A color in the RGB model.
 */
export class RgbColor extends Color implements Rgb {
  static fromHex(hex: number): RgbColor {
    const r = (hex >>> 16) & 0xff;
    const g = (hex >>> 8) & 0xff;
    const b = (hex >>> 0) & 0xff;
    return new RgbColor(r / 255, g / 255, b / 255);
  }

  #r!: number;
  #g!: number;
  #b!: number;
  #alpha!: number;

  constructor();
  constructor(r: number, g: number, b: number, alpha?: number);
  constructor(value: Readonly<Rgb>);
  constructor(...args: any[]) {
    super();
    const l = args.length;
    if (l === 0) {
      this.#r = 0;
      this.#g = 0;
      this.#b = 0;
      this.#alpha = 1;
      return;
    }
    if (
      l === 3 &&
      isNumber(args[0]) &&
      isNumber(args[1]) &&
      isNumber(args[2])
    ) {
      this.r = args[0];
      this.g = args[1];
      this.b = args[2];
      this.alpha = 1;
      return this;
    }
    if (
      l === 4 &&
      isNumber(args[0]) &&
      isNumber(args[1]) &&
      isNumber(args[2]) &&
      isNumber(args[3])
    ) {
      this.r = args[0];
      this.g = args[1];
      this.b = args[2];
      this.alpha = args[3];
      return this;
    }
    const [value] = args;
    if (l === 1 && RgbColor.is(value)) {
      this.r = value.r;
      this.g = value.g;
      this.b = value.b;
      this.alpha = value.alpha;
      return this;
    }
    throw new TypeError();
  }

  get r(): number {
    return this.#r;
  }

  set r(value: number) {
    this.#r = clamp(value, 0, 1);
  }

  get g(): number {
    return this.#g;
  }

  set g(value: number) {
    this.#g = clamp(value, 0, 1);
  }

  get b(): number {
    return this.#b;
  }

  set b(value: number) {
    this.#b = clamp(value, 0, 1);
  }

  get alpha(): number {
    return this.#alpha;
  }

  set alpha(value: number) {
    this.#alpha = clamp(value, 0, 1);
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
    const alpha = round(this.alpha, 3);
    if (alpha < 1) {
      return `rgb(${r} ${g} ${b}/${alpha})`;
    } else {
      return `rgb(${r} ${g} ${b})`;
    }
  }

  formatHex(): string {
    const r = Math.round(this.r * 255);
    const g = Math.round(this.g * 255);
    const b = Math.round(this.b * 255);
    const alpha = Math.round(this.alpha * 255);
    if (alpha < 255) {
      return `#${pad0(r) + pad0(g) + pad0(b) + pad0(alpha)}`;
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

  get [Symbol.toStringTag]() {
    return "RgbColor";
  }

  static is(o: any): o is Rgb {
    return (
      isObjectLike(o) &&
      isNumber(o.r) &&
      isNumber(o.g) &&
      isNumber(o.b) &&
      (o.alpha == null || isNumber(o.alpha))
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
