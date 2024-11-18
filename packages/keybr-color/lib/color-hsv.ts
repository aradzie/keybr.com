import { clamp, isNumber, isObjectLike } from "@keybr/lang";
import { Color } from "./color.ts";
import { hsvToHsl, hsvToRgb } from "./convert.ts";
import { type Hsv } from "./types.ts";

/**
 * A color in the HSV model.
 */
export class HsvColor extends Color implements Hsv {
  h: number;
  s: number;
  v: number;
  a: number;

  constructor(h: number, s: number, v: number, a?: number);
  constructor(value: Readonly<{ h: number; s: number; v: number; a?: number }>);
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
      this.v = clamp(args[2], 0, 1);
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
      this.v = clamp(args[2], 0, 1);
      this.a = clamp(args[3], 0, 1);
      return this;
    }
    const [value] = args;
    if (l === 1 && HsvColor.is(value)) {
      this.h = clamp(value.h, 0, 1);
      this.s = clamp(value.s, 0, 1);
      this.v = clamp(value.v, 0, 1);
      this.a = clamp(value.a ?? 1, 0, 1);
      return this;
    }
    throw new TypeError();
  }

  override toRgb() {
    return hsvToRgb(this);
  }

  override toHsl(clone?: boolean) {
    return hsvToHsl(this);
  }

  override toHsv(clone?: boolean) {
    if (clone) {
      return new HsvColor(this);
    }
    return this;
  }

  override format() {
    return this.toHsl().format();
  }

  static is(o: any): o is Hsv {
    return (
      isObjectLike(o) &&
      isNumber(o.h) &&
      isNumber(o.s) &&
      isNumber(o.v) &&
      (o.a == null || isNumber(o.a))
    );
  }
}
