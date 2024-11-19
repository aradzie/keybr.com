import { clamp, isNumber, isObjectLike } from "@keybr/lang";
import { Color } from "./color.ts";
import { hslToRgb, hsvToHsl } from "./convert.ts";
import { type Hsv } from "./types.ts";

/**
 * A color in the HSV model.
 */
export class HsvColor extends Color implements Hsv {
  #h: number = 0;
  #s: number = 0;
  #v: number = 0;
  #a: number = 1;

  constructor();
  constructor(h: number, s: number, v: number, a?: number);
  constructor(value: Readonly<{ h: number; s: number; v: number; a?: number }>);
  constructor(...args: any[]) {
    super();
    const l = args.length;
    if (l === 0) {
      return;
    }
    if (
      l === 3 &&
      isNumber(args[0]) &&
      isNumber(args[1]) &&
      isNumber(args[2])
    ) {
      this.h = args[0];
      this.s = args[1];
      this.v = args[2];
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
      this.h = args[0];
      this.s = args[1];
      this.v = args[2];
      this.a = args[3];
      return this;
    }
    const [value] = args;
    if (l === 1 && HsvColor.is(value)) {
      this.h = value.h;
      this.s = value.s;
      this.v = value.v;
      this.a = value.a ?? 1;
      return this;
    }
    throw new TypeError();
  }

  get h(): number {
    return this.#h;
  }

  set h(value: number) {
    this.#h = clamp(value, 0, 1);
  }

  get s(): number {
    return this.#s;
  }

  set s(value: number) {
    this.#s = clamp(value, 0, 1);
  }

  get v(): number {
    return this.#v;
  }

  set v(value: number) {
    this.#v = clamp(value, 0, 1);
  }

  get a(): number {
    return this.#a;
  }

  set a(value: number) {
    this.#a = clamp(value, 0, 1);
  }

  override toRgb() {
    return hslToRgb(hsvToHsl(this));
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

  get [Symbol.toStringTag]() {
    return "HsvColor";
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
