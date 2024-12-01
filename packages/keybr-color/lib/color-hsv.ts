import { clamp, isNumber } from "@keybr/lang";
import { isHsv } from "./classify.ts";
import { Color } from "./color.ts";
import { hslToRgb, hsvToHsl } from "./convert-rgb.ts";
import { type Hsv } from "./types.ts";

/**
 * A color in the HSV model.
 */
export class HsvColor extends Color implements Hsv {
  #h!: number;
  #s!: number;
  #v!: number;
  #alpha!: number;

  constructor();
  constructor(h: number, s: number, v: number, alpha?: number);
  constructor(value: Readonly<Hsv>);
  constructor(...args: any[]) {
    super();
    const l = args.length;
    if (l === 0) {
      this.#h = 0;
      this.#s = 0;
      this.#v = 0;
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
      this.v = args[2];
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
      this.v = args[2];
      this.alpha = args[3];
      return this;
    }
    const [value] = args;
    if (l === 1 && isHsv(value)) {
      this.h = value.h;
      this.s = value.s;
      this.v = value.v;
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

  get v(): number {
    return this.#v;
  }

  set v(value: number) {
    this.#v = clamp(value, 0, 1);
  }

  get alpha(): number {
    return this.#alpha;
  }

  set alpha(value: number) {
    this.#alpha = clamp(value, 0, 1);
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
}
