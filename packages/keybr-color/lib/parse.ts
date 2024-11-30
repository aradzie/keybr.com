import { clamp } from "@keybr/lang";
import { type Color } from "./color.ts";
import { HslColor } from "./color-hsl.ts";
import { HwbColor } from "./color-hwb.ts";
import { OklabColor } from "./color-oklab.ts";
import { OklchColor } from "./color-oklch.ts";
import { RgbColor } from "./color-rgb.ts";
import { namedColors } from "./named-colors.ts";
import { parseHex } from "./parse-hex.ts";

/**
 * Returns an RGB color from the hex number with RGB components.
 * @param hex A number with RGB components.
 * @return An RGB color instance.
 */
export function hexColor(hex: number): RgbColor {
  const r = (hex >>> 16) & 0xff;
  const g = (hex >>> 8) & 0xff;
  const b = hex & 0xff;
  return new RgbColor(r / 255, g / 255, b / 255);
}

export function tryParseColor(value: string): Color | null {
  value = value.trim();
  if (value === "transparent") {
    return new RgbColor(0, 0, 0, 0);
  }
  const hex = namedColors[value];
  if (hex != null) {
    return RgbColor.fromHex(hex);
  }
  return parseHex(value) ?? new Parser(value).parse();
}

export function parseColor(value: string): Color {
  const color = tryParseColor(value);
  if (color == null) {
    throw new TypeError();
  }
  return color;
}

const rWs = /\s+/y;
const rLB = /\(\s*/y;
const rRB = /\s*\)/y;
const rComma = /\s*,\s*/y;
const rSlash = /\s*\/\s*/y;
const rRgb = /rgba?/y;
const rHsl = /hsla?/y;
const rHwb = /hwb/y;
const rOklab = /oklab/y;
const rOklch = /oklch/y;
const rNone = /none/y;
const rNumber = /[-+]?[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?/y;
const rPct = /%/y;
const rDeg = /deg/y;
const rRad = /rad/y;
const rTurn = /turn/y;

type Unit = {
  none: number;
  min: number;
  max: number;
  scaleNum: number;
  scalePct: number;
};

const valueUnit: Unit = {
  none: 0,
  min: 0,
  max: 1,
  scaleNum: 1,
  scalePct: 1,
} as const;

const alphaUnit: Unit = {
  none: 1,
  min: 0,
  max: 1,
  scaleNum: 1,
  scalePct: 1,
} as const;

const rgbUnit: Unit = {
  none: 0,
  min: 0,
  max: 1,
  scaleNum: 255,
  scalePct: 1,
} as const;

const hslUnit: Unit = {
  none: 0,
  min: 0,
  max: 1,
  scaleNum: 100,
  scalePct: 1,
} as const;

const labUnit: Unit = {
  none: 0,
  min: -0.4,
  max: 0.4,
  scaleNum: 1,
  scalePct: 2.5,
} as const;

const lchUnit: Unit = {
  none: 0,
  min: 0,
  max: 0.4,
  scaleNum: 1,
  scalePct: 2.5,
} as const;

type Prop = "x" | "y" | "z" | "alpha";

class Parser {
  index = 0;
  start = 0;

  x = 0;
  y = 0;
  z = 0;
  alpha = 1;

  constructor(readonly value: string) {}

  reset() {
    this.index = 0;
    this.start = 0;
  }

  end() {
    return this.index === this.value.length;
  }

  image() {
    return this.value.substring(this.start, this.index);
  }

  eat(re: RegExp) {
    this.start = re.lastIndex = this.index;
    if (re.test(this.value)) {
      this.index = re.lastIndex;
      return true;
    } else {
      return false;
    }
  }

  try(p: () => boolean) {
    const index = this.index;
    if (p()) {
      return true;
    } else {
      this.index = index;
      return false;
    }
  }

  parseNumber(prop: Prop, unit: Unit) {
    if (this.eat(rNone)) {
      this[prop] = unit.none;
      return true;
    }
    if (this.eat(rNumber)) {
      let v = Number(this.image());
      if (this.eat(rPct)) {
        v = v / 100 / unit.scalePct;
      } else {
        v = v / unit.scaleNum;
      }
      this[prop] = clamp(v, unit.min, unit.max);
      return true;
    }
    return false;
  }

  parseAngle(prop: Prop) {
    if (this.eat(rNone)) {
      this[prop] = 0;
      return true;
    }
    if (this.eat(rNumber)) {
      let v = Number(this.image());
      if (this.eat(rPct)) {
        v = v / 100;
      } else if (this.eat(rDeg)) {
        v = v / 360;
      } else if (this.eat(rRad)) {
        v = v / (Math.PI * 2);
      } else if (this.eat(rTurn)) {
        v = v / 1;
      } else {
        v = v / 360;
      }
      if (v < 0 || v > 1) {
        v = v - Math.floor(v);
      }
      this[prop] = v;
      return true;
    }
    return false;
  }

  parseRgb() {
    this.reset();
    if (
      this.eat(rRgb) &&
      this.eat(rLB) &&
      this.parseNumber("x", rgbUnit) &&
      this.eat(rWs) &&
      this.parseNumber("y", rgbUnit) &&
      this.eat(rWs) &&
      this.parseNumber("z", rgbUnit) &&
      (!this.eat(rSlash) || this.parseNumber("alpha", alphaUnit)) &&
      this.eat(rRB) &&
      this.end()
    ) {
      return new RgbColor(this.x, this.y, this.z, this.alpha);
    }
    return null;
  }

  parseRgbLegacy() {
    this.reset();
    if (
      this.eat(rRgb) &&
      this.eat(rLB) &&
      this.parseNumber("x", rgbUnit) &&
      this.eat(rComma) &&
      this.parseNumber("y", rgbUnit) &&
      this.eat(rComma) &&
      this.parseNumber("z", rgbUnit) &&
      (!this.eat(rComma) || this.parseNumber("alpha", alphaUnit)) &&
      this.eat(rRB) &&
      this.end()
    ) {
      return new RgbColor(this.x, this.y, this.z, this.alpha);
    }
    return null;
  }

  parseHsl() {
    this.reset();
    if (
      this.eat(rHsl) &&
      this.eat(rLB) &&
      this.parseAngle("x") &&
      this.eat(rWs) &&
      this.parseNumber("y", hslUnit) &&
      this.eat(rWs) &&
      this.parseNumber("z", hslUnit) &&
      (!this.eat(rSlash) || this.parseNumber("alpha", alphaUnit)) &&
      this.eat(rRB) &&
      this.end()
    ) {
      return new HslColor(this.x, this.y, this.z, this.alpha);
    }
    return null;
  }

  parseHslLegacy() {
    this.reset();
    if (
      this.eat(rHsl) &&
      this.eat(rLB) &&
      this.parseAngle("x") &&
      this.eat(rComma) &&
      this.parseNumber("y", hslUnit) &&
      this.eat(rComma) &&
      this.parseNumber("z", hslUnit) &&
      (!this.eat(rComma) || this.parseNumber("alpha", alphaUnit)) &&
      this.eat(rRB) &&
      this.end()
    ) {
      return new HslColor(this.x, this.y, this.z, this.alpha);
    }
    return null;
  }

  parseHwb() {
    this.reset();
    if (
      this.eat(rHwb) &&
      this.eat(rLB) &&
      this.parseAngle("x") &&
      this.eat(rWs) &&
      this.parseNumber("y", hslUnit) &&
      this.eat(rWs) &&
      this.parseNumber("z", hslUnit) &&
      (!this.eat(rSlash) || this.parseNumber("alpha", alphaUnit)) &&
      this.eat(rRB) &&
      this.end()
    ) {
      return new HwbColor(this.x, this.y, this.z, this.alpha);
    }
    return null;
  }

  parseOklab() {
    this.reset();
    if (
      this.eat(rOklab) &&
      this.eat(rLB) &&
      this.parseNumber("x", valueUnit) &&
      this.eat(rWs) &&
      this.parseNumber("y", labUnit) &&
      this.eat(rWs) &&
      this.parseNumber("z", labUnit) &&
      (!this.eat(rSlash) || this.parseNumber("alpha", alphaUnit)) &&
      this.eat(rRB) &&
      this.end()
    ) {
      return new OklabColor(this.x, this.y, this.z, this.alpha);
    }
    return null;
  }

  parseOklch() {
    this.reset();
    if (
      this.eat(rOklch) &&
      this.eat(rLB) &&
      this.parseNumber("x", valueUnit) &&
      this.eat(rWs) &&
      this.parseNumber("y", lchUnit) &&
      this.eat(rWs) &&
      this.parseAngle("z") &&
      (!this.eat(rSlash) || this.parseNumber("alpha", alphaUnit)) &&
      this.eat(rRB) &&
      this.end()
    ) {
      return new OklchColor(this.x, this.y, this.z, this.alpha);
    }
    return null;
  }

  parse() {
    return (
      this.parseRgb() ??
      this.parseRgbLegacy() ??
      this.parseHsl() ??
      this.parseHslLegacy() ??
      this.parseHwb() ??
      this.parseOklab() ??
      this.parseOklch()
    );
  }
}
