import { clamp, isNumber, round } from "@keybr/lang";
import { isHwb } from "./classify.ts";
import { Color } from "./color.ts";
import { hwbToHsl, hwbToHsv, hwbToRgb } from "./convert-rgb.ts";
import { type Hwb } from "./types.ts";

/**
 * A color in the HWB model.
 */
export class HwbColor extends Color implements Hwb {
  #h!: number;
  #w!: number;
  #b!: number;
  #alpha!: number;

  constructor();
  constructor(h: number, w: number, b: number, alpha?: number);
  constructor(value: Readonly<Hwb>);
  constructor(...args: any[]) {
    super();
    const l = args.length;
    if (l === 0) {
      this.#h = 0;
      this.#w = 0;
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
      this.h = args[0];
      this.w = args[1];
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
      this.h = args[0];
      this.w = args[1];
      this.b = args[2];
      this.alpha = args[3];
      return this;
    }
    const [value] = args;
    if (l === 1 && isHwb(value)) {
      this.h = value.h;
      this.w = value.w;
      this.b = value.b;
      this.alpha = value.alpha;
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

  get alpha(): number {
    return this.#alpha;
  }

  set alpha(value: number) {
    this.#alpha = clamp(value, 0, 1);
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
    const h = round(this.h * 360, 3);
    const w = round(this.w * 100, 3);
    const b = round(this.b * 100, 3);
    const alpha = round(this.alpha, 3);
    if (alpha < 1) {
      return `hwb(${h} ${w}% ${b}%/${alpha})`;
    } else {
      return `hwb(${h} ${w}% ${b}%)`;
    }
  }

  get [Symbol.toStringTag]() {
    return "HwbColor";
  }
}
