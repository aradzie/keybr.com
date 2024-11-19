import { clamp, isNumber, isObjectLike } from "@keybr/lang";
import { Color } from "./color.ts";
import { hwbToHsl, hwbToHsv, hwbToRgb } from "./convert.ts";
import { type Hwb } from "./types.ts";

/**
 * A color in the HWB model.
 */
export class HwbColor extends Color implements Hwb {
  h: number;
  w: number;
  b: number;
  a: number;

  constructor(h: number, w: number, b: number, a?: number);
  constructor(value: Readonly<{ h: number; w: number; b: number; a?: number }>);
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
      this.w = clamp(args[1], 0, 1);
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
      this.h = clamp(args[0], 0, 1);
      this.w = clamp(args[1], 0, 1);
      this.b = clamp(args[2], 0, 1);
      this.a = clamp(args[3], 0, 1);
      return this;
    }
    const [value] = args;
    if (l === 1 && HwbColor.is(value)) {
      this.h = clamp(value.h, 0, 1);
      this.w = clamp(value.w, 0, 1);
      this.b = clamp(value.b, 0, 1);
      this.a = clamp(value.a ?? 1, 0, 1);
      return this;
    }
    throw new TypeError();
  }

  override toRgb() {
    return hwbToRgb(this);
  }

  override toHsl() {
    return hwbToHsl(this);
  }

  override toHsv() {
    return hwbToHsv(this);
  }

  override format() {
    const h = Math.round(this.h * 360);
    const w = Math.round(this.w * 100);
    const b = Math.round(this.b * 100);
    const a = this.a;
    if (a < 1) {
      return `hwb(${h} ${w}% ${b}%/${a})`;
    } else {
      return `hwb(${h} ${w}% ${b}%)`;
    }
  }

  static is(o: any): o is Hwb {
    return (
      isObjectLike(o) &&
      isNumber(o.h) &&
      isNumber(o.w) &&
      isNumber(o.b) &&
      (o.a == null || isNumber(o.a))
    );
  }
}
