import { clamp } from "@keybr/lang";
import { type Color } from "./color.ts";
import { HslColor } from "./color-hsl.ts";
import { HwbColor } from "./color-hwb.ts";
import { RgbColor } from "./color-rgb.ts";
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
const rLB = /\s*\(\s*/y;
const rRB = /\s*\)\s*/y;
const rComma = /\s*,\s*/y;
const rSlash = /\s*\/\s*/y;
const rRgb = /rgba?/y;
const rHsl = /hsla?/y;
const rHwb = /hwb/y;
const rNone = /none/y;
const rNumber = /[-+]?[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?/y;
const rPct = /%/y;
const rDeg = /deg/y;
const rRad = /rad/y;
const rColor = /color/y;
const rSRgb = /sRGB/y;
const rDisplayP3 = /display-p3/y;

type Unit = {
  none: number;
  min: number;
  max: number;
  scale: number;
};

const colorUnit: Unit = {
  none: 0,
  min: 0,
  max: 1,
  scale: 255,
} as const;

const lightnessUnit: Unit = {
  none: 0,
  min: 0,
  max: 100,
  scale: 100,
} as const;

const alphaUnit: Unit = {
  none: 1,
  min: 0,
  max: 1,
  scale: 1,
} as const;

const valueUnit: Unit = {
  none: 0,
  min: 0,
  max: 1,
  scale: 1,
} as const;

type Prop = "x" | "y" | "z" | "a";

class Parser {
  index = 0;
  start = 0;

  x = 0;
  y = 0;
  z = 0;
  a = 1;

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
        v = v / 100;
      } else {
        v = v / unit.scale;
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
      this.parseNumber("x", colorUnit) &&
      this.eat(rWs) &&
      this.parseNumber("y", colorUnit) &&
      this.eat(rWs) &&
      this.parseNumber("z", colorUnit) &&
      (!this.eat(rSlash) || this.parseNumber("a", alphaUnit)) &&
      this.eat(rRB) &&
      this.end()
    ) {
      return new RgbColor(this.x, this.y, this.z, this.a);
    }
    return null;
  }

  parseRgbLegacy() {
    this.reset();
    if (
      this.eat(rRgb) &&
      this.eat(rLB) &&
      this.parseNumber("x", colorUnit) &&
      this.eat(rComma) &&
      this.parseNumber("y", colorUnit) &&
      this.eat(rComma) &&
      this.parseNumber("z", colorUnit) &&
      (!this.eat(rComma) || this.parseNumber("a", alphaUnit)) &&
      this.eat(rRB) &&
      this.end()
    ) {
      return new RgbColor(this.x, this.y, this.z, this.a);
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
      this.parseNumber("y", lightnessUnit) &&
      this.eat(rWs) &&
      this.parseNumber("z", lightnessUnit) &&
      (!this.eat(rSlash) || this.parseNumber("a", alphaUnit)) &&
      this.eat(rRB) &&
      this.end()
    ) {
      return new HslColor(this.x, this.y, this.z, this.a);
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
      this.parseNumber("y", lightnessUnit) &&
      this.eat(rComma) &&
      this.parseNumber("z", lightnessUnit) &&
      (!this.eat(rComma) || this.parseNumber("a", alphaUnit)) &&
      this.eat(rRB) &&
      this.end()
    ) {
      return new HslColor(this.x, this.y, this.z, this.a);
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
      this.parseNumber("y", lightnessUnit) &&
      this.eat(rWs) &&
      this.parseNumber("z", lightnessUnit) &&
      (!this.eat(rSlash) || this.parseNumber("a", alphaUnit)) &&
      this.eat(rRB) &&
      this.end()
    ) {
      return new HwbColor(this.x, this.y, this.z, this.a);
    }
    return null;
  }

  parseColor() {
    this.reset();
    if (this.eat(rColor)) {
      if (
        this.try(
          () =>
            this.eat(rLB) &&
            this.eat(rSRgb) &&
            this.eat(rWs) &&
            this.parseNumber("x", valueUnit) &&
            this.eat(rWs) &&
            this.parseNumber("y", valueUnit) &&
            this.eat(rWs) &&
            this.parseNumber("z", valueUnit) &&
            this.eat(rRB) &&
            this.end(),
        )
      ) {
        //
      }
      if (
        this.try(
          () =>
            this.eat(rLB) &&
            this.eat(rDisplayP3) &&
            this.eat(rWs) &&
            this.parseNumber("x", valueUnit) &&
            this.eat(rWs) &&
            this.parseNumber("y", valueUnit) &&
            this.eat(rWs) &&
            this.parseNumber("z", valueUnit) &&
            this.eat(rRB) &&
            this.end(),
        )
      ) {
        //
      }
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
      this.parseColor()
    );
  }
}
