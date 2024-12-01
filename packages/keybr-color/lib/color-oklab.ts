import { clamp, isNumber, round } from "@keybr/lang";
import { isOklab } from "./classify.ts";
import { Color } from "./color.ts";
import { hslToHsv, rgbToHsl } from "./convert-rgb.ts";
import { oklabToRgb } from "./convert-xyz.ts";
import { type Oklab } from "./types.ts";

/**
 * A color in the Oklab model.
 */
export class OklabColor extends Color implements Oklab {
  #l!: number;
  #a!: number;
  #b!: number;
  #alpha!: number;

  constructor();
  constructor(l: number, a: number, b: number, alpha?: number);
  constructor(value: Readonly<Oklab>);
  constructor(...args: any[]) {
    super();
    const l = args.length;
    if (l === 0) {
      this.#l = 0;
      this.#a = 0;
      this.#b = 0;
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
      this.a = args[1];
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
      this.l = args[0];
      this.a = args[1];
      this.b = args[2];
      this.alpha = args[3];
      return this;
    }
    const [value] = args;
    if (l === 1 && isOklab(value)) {
      this.l = value.l;
      this.a = value.a;
      this.b = value.b;
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

  get a(): number {
    return this.#a;
  }

  set a(value: number) {
    this.#a = clamp(value, -0.4, 0.4);
  }

  get b(): number {
    return this.#b;
  }

  set b(value: number) {
    this.#b = clamp(value, -0.4, 0.4);
  }

  get alpha(): number {
    return this.#alpha;
  }

  set alpha(value: number) {
    this.#alpha = clamp(value, 0, 1);
  }

  override toRgb(clone?: boolean) {
    return oklabToRgb(this);
  }

  override toHsl() {
    return rgbToHsl(this.toRgb());
  }

  override toHsv() {
    return hslToHsv(rgbToHsl(this.toRgb()));
  }

  override format() {
    const l = round(this.l, 3);
    const a = round(this.a, 3);
    const b = round(this.b, 3);
    const alpha = round(this.alpha, 3);
    if (alpha < 1) {
      return `oklab(${l} ${a} ${b}/${alpha})`;
    } else {
      return `oklab(${l} ${a} ${b})`;
    }
  }

  get [Symbol.toStringTag]() {
    return "OklabColor";
  }
}
