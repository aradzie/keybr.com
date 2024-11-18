import { clamp, isNumber, isObjectLike } from "@keybr/lang";
import { Color } from "./color.ts";
import { hslToHsv, hslToRgb } from "./convert.ts";
import { type Hsl } from "./types.ts";

/**
 * A color in the HSL model.
 */
export class HslColor extends Color implements Hsl {
  h: number;
  s: number;
  l: number;
  a: number;

  constructor(h: number, s: number, l: number, a?: number);
  constructor(value: Readonly<{ h: number; s: number; l: number; a?: number }>);
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
    if (l === 1 && HslColor.is(value)) {
      this.h = clamp(value.h, 0, 1);
      this.s = clamp(value.s, 0, 1);
      this.l = clamp(value.l, 0, 1);
      this.a = clamp(value.a ?? 1, 0, 1);
      return this;
    }
    throw new TypeError();
  }

  override toRgb() {
    return hslToRgb(this);
  }

  override toHsl(clone?: boolean) {
    if (clone) {
      return new HslColor(this);
    }
    return this;
  }

  override toHsv(clone?: boolean) {
    return hslToHsv(this);
  }

  override format() {
    const h = Math.round(this.h * 360);
    const s = Math.round(this.s * 100);
    const l = Math.round(this.l * 100);
    const a = this.a;
    if (a < 1) {
      return `hsl(${h} ${s}% ${l}%/${a})`;
    } else {
      return `hsl(${h} ${s}% ${l}%)`;
    }
  }

  static is(o: any): o is Hsl {
    return (
      isObjectLike(o) &&
      isNumber(o.h) &&
      isNumber(o.s) &&
      isNumber(o.l) &&
      (o.a == null || isNumber(o.a))
    );
  }
}
