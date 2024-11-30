import { clamp, isNumber, isObjectLike, round } from "@keybr/lang";
import { Color } from "./color.ts";
import { hslToHsv, rgbToHsl } from "./convert-rgb.ts";
import { oklabToRgb } from "./convert-xyz.ts";
import { type Oklab } from "./types.ts";

/**
 * A color in the Oklab model.
 */
export class OklabColor extends Color implements Oklab {
  #L!: number;
  #A!: number;
  #B!: number;
  #a!: number;

  constructor();
  constructor(L: number, A: number, B: number, a?: number);
  constructor(value: Readonly<{ L: number; A: number; B: number; a?: number }>);
  constructor(...args: any[]) {
    super();
    const l = args.length;
    if (l === 0) {
      this.#L = 0;
      this.#A = 0;
      this.#B = 0;
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
      this.A = args[1];
      this.B = args[2];
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
      this.A = args[1];
      this.B = args[2];
      this.a = args[3];
      return this;
    }
    const [value] = args;
    if (l === 1 && OklabColor.is(value)) {
      this.L = value.L;
      this.A = value.A;
      this.B = value.B;
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

  get A(): number {
    return this.#A;
  }

  set A(value: number) {
    this.#A = clamp(value, -0.4, 0.4);
  }

  get B(): number {
    return this.#B;
  }

  set B(value: number) {
    this.#B = clamp(value, -0.4, 0.4);
  }

  get a(): number {
    return this.#a;
  }

  set a(value: number) {
    this.#a = clamp(value, 0, 1);
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
    const L = round(this.L, 3);
    const A = round(this.A, 3);
    const B = round(this.B, 3);
    const a = round(this.a, 3);
    if (a < 1) {
      return `oklab(${L} ${A} ${B}/${a})`;
    } else {
      return `oklab(${L} ${A} ${B})`;
    }
  }

  get [Symbol.toStringTag]() {
    return "OklabColor";
  }

  static is(o: any): o is Oklab {
    return (
      isObjectLike(o) &&
      isNumber(o.L) &&
      isNumber(o.A) &&
      isNumber(o.B) &&
      (o.a == null || isNumber(o.a))
    );
  }
}
