import { clamp, isNumber, isObjectLike } from "@keybr/lang";
import { Color } from "./color.ts";
import { hwbToHsl, hwbToHsv, hwbToRgb } from "./convert.ts";
import { type Hwb } from "./types.ts";

/**
 * A color in the HWB model.
 */
export class HwbColor extends Color implements Hwb {
  #h!: number;
  #w!: number;
  #b!: number;
  #a!: number;

  constructor();
  constructor(h: number, w: number, b: number, a?: number);
  constructor(value: Readonly<{ h: number; w: number; b: number; a?: number }>);
  constructor(...args: any[]) {
    super();
    const l = args.length;
    if (l === 0) {
      this.#h = 0;
      this.#w = 0;
      this.#b = 0;
      this.#a = 1;
      return;
    }
    if (
      l === 3 &&
      isNumber(args[0]) &&
      isNumber(args[1]) &&
      isNumber(args[2])
    ) {
      this.h = args[0];
      this.w = args[1];
      this.b = args[2];
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
      this.w = args[1];
      this.b = args[2];
      this.a = args[3];
      return this;
    }
    const [value] = args;
    if (l === 1 && HwbColor.is(value)) {
      this.h = value.h;
      this.w = value.w;
      this.b = value.b;
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

  get w(): number {
    return this.#w;
  }

  set w(value: number) {
    this.#w = clamp(value, 0, 1);
  }

  get b(): number {
    return this.#b;
  }

  set b(value: number) {
    this.#b = clamp(value, 0, 1);
  }

  get a(): number {
    return this.#a;
  }

  set a(value: number) {
    this.#a = clamp(value, 0, 1);
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

  get [Symbol.toStringTag]() {
    return "HwbColor";
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
