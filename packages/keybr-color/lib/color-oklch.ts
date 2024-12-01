import { clamp, isNumber, round } from "@keybr/lang";
import { isOklch } from "./classify.ts";
import { Color } from "./color.ts";
import { hslToHsv, rgbToHsl } from "./convert-rgb.ts";
import { oklchToRgb } from "./convert-xyz.ts";
import { type Oklch } from "./types.ts";

/**
 * A color in the Oklch model.
 */
export class OklchColor extends Color implements Oklch {
  #l!: number;
  #c!: number;
  #h!: number;
  #alpha!: number;

  constructor();
  constructor(l: number, c: number, h: number, alpha?: number);
  constructor(value: Readonly<Oklch>);
  constructor(...args: any[]) {
    super();
    const l = args.length;
    if (l === 0) {
      this.#l = 0;
      this.#c = 0;
      this.#h = 0;
      this.#alpha = 1;
      return this;
    }
    if (
      l === 3 &&
      isNumber(args[0]) &&
      isNumber(args[1]) &&
      isNumber(args[2])
    ) {
      this.l = args[0];
      this.c = args[1];
      this.h = args[2];
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
      this.l = args[0];
      this.c = args[1];
      this.h = args[2];
      this.alpha = args[3];
      return this;
    }
    const [value] = args;
    if (l === 1 && isOklch(value)) {
      this.l = value.l;
      this.c = value.c;
      this.h = value.h;
      this.alpha = value.alpha;
      return this;
    }
    throw new TypeError();
  }

  get l(): number {
    return this.#l;
  }

  set l(value: number) {
    this.#l = clamp(value, 0, 1);
  }

  get c(): number {
    return this.#c;
  }

  set c(value: number) {
    this.#c = clamp(value, 0, 0.4);
  }

  get h(): number {
    return this.#h;
  }

  set h(value: number) {
    this.#h = clamp(value, 0, 1);
  }

  get alpha(): number {
    return this.#alpha;
  }

  set alpha(value: number) {
    this.#alpha = clamp(value, 0, 1);
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
    const l = round(this.l, 3);
    const c = round(this.c, 3);
    const h = round(this.h * 360, 3);
    const alpha = round(this.alpha, 3);
    if (alpha < 1) {
      return `oklch(${l} ${c} ${h}/${alpha})`;
    } else {
      return `oklch(${l} ${c} ${h})`;
    }
  }

  get [Symbol.toStringTag]() {
    return "OklchColor";
  }
}
