import { clamp, isNumber, isObjectLike } from "@keybr/lang";
import { Color } from "./color.ts";
import { hslToHsv, rgbToHsl } from "./convert-rgb.ts";
import { oklchToRgb } from "./convert-xyz.ts";
import { type Oklch } from "./types.ts";
import { round } from "./util.ts";

/**
 * A color in the Oklch model.
 */
export class OklchColor extends Color implements Oklch {
  #L!: number;
  #C!: number;
  #h!: number;
  #a!: number;

  constructor();
  constructor(L: number, C: number, h: number, a?: number);
  constructor(value: Readonly<{ L: number; C: number; h: number; a?: number }>);
  constructor(...args: any[]) {
    super();
    const l = args.length;
    if (l === 0) {
      this.#L = 0;
      this.#C = 0;
      this.#h = 0;
      this.#a = 1;
      return this;
    }
    if (
      l === 3 &&
      isNumber(args[0]) &&
      isNumber(args[1]) &&
      isNumber(args[2])
    ) {
      this.L = args[0];
      this.C = args[1];
      this.h = args[2];
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
      this.L = args[0];
      this.C = args[1];
      this.h = args[2];
      this.a = args[3];
      return this;
    }
    const [value] = args;
    if (l === 1 && OklchColor.is(value)) {
      this.L = value.L;
      this.C = value.C;
      this.h = value.h;
      this.a = value.a ?? 1;
      return this;
    }
    throw new TypeError();
  }

  get L(): number {
    return this.#L;
  }

  set L(value: number) {
    this.#L = clamp(value, 0, 1);
  }

  get C(): number {
    return this.#C;
  }

  set C(value: number) {
    this.#C = clamp(value, 0, 0.4);
  }

  get h(): number {
    return this.#h;
  }

  set h(value: number) {
    this.#h = clamp(value, 0, 1);
  }

  get a(): number {
    return this.#a;
  }

  set a(value: number) {
    this.#a = clamp(value, 0, 1);
  }

  override toRgb(clone?: boolean) {
    return oklchToRgb(this);
  }

  override toHsl() {
    return rgbToHsl(this.toRgb());
  }

  override toHsv() {
    return hslToHsv(rgbToHsl(this.toRgb()));
  }

  override format() {
    const L = round(this.L);
    const C = round(this.C);
    const h = Math.round(this.h * 360);
    const a = round(this.a);
    if (a < 1) {
      return `oklch(${L} ${C} ${h}/${a})`;
    } else {
      return `oklch(${L} ${C} ${h})`;
    }
  }

  get [Symbol.toStringTag]() {
    return "OklchColor";
  }

  static is(o: any): o is Oklch {
    return (
      isObjectLike(o) &&
      isNumber(o.L) &&
      isNumber(o.C) &&
      isNumber(o.h) &&
      (o.a == null || isNumber(o.a))
    );
  }
}
