import { clamp, isNumber, round } from "@keybr/lang";
import { isHsl } from "./classify.ts";
import { Color } from "./color.ts";
import { hslToHsv, hslToRgb } from "./convert-rgb.ts";
import { type Hsl } from "./types.ts";

/**
 * A color in the HSL model.
 */
export class HslColor extends Color implements Hsl {
  #h!: number;
  #s!: number;
  #l!: number;
  #alpha!: number;

  constructor();
  constructor(h: number, s: number, l: number, alpha?: number);
  constructor(value: Readonly<Hsl>);
  constructor(...args: any[]) {
    super();
    const l = args.length;
    if (l === 0) {
      this.#h = 0;
      this.#s = 0;
      this.#l = 0;
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
      this.s = args[1];
      this.l = args[2];
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
      this.s = args[1];
      this.l = args[2];
      this.alpha = args[3];
      return this;
    }
    const [value] = args;
    if (l === 1 && isHsl(value)) {
      this.h = value.h;
      this.s = value.s;
      this.l = value.l;
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

  get s(): number {
    return this.#s;
  }

  set s(value: number) {
    this.#s = clamp(value, 0, 1);
  }

  get l(): number {
    return this.#l;
  }

  set l(value: number) {
    this.#l = clamp(value, 0, 1);
  }

  get alpha(): number {
    return this.#alpha;
  }

  set alpha(value: number) {
    this.#alpha = clamp(value, 0, 1);
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
    const h = round(this.h * 360, 3);
    const s = round(this.s * 100, 3);
    const l = round(this.l * 100, 3);
    const alpha = round(this.alpha, 3);
    if (alpha < 1) {
      return `hsl(${h} ${s}% ${l}%/${alpha})`;
    } else {
      return `hsl(${h} ${s}% ${l}%)`;
    }
  }

  get [Symbol.toStringTag]() {
    return "HslColor";
  }
}
