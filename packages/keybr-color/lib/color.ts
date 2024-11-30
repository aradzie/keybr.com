import { clamp } from "@keybr/lang";
import { type HslColor } from "./color-hsl.ts";
import { type HsvColor } from "./color-hsv.ts";
import { type RgbColor } from "./color-rgb.ts";

/** Base abstract color class. */
export abstract class Color {
  /**
   * Converts to the RGB model.
   * @param clone Whether to make a new clone if already is RGB. Otherwise returns this.
   * @return A color in the RGB model.
   */
  abstract toRgb(clone?: boolean): RgbColor;

  /**
   * Converts to the HSL model.
   * @param clone Whether to make a new clone if already is HSL. Otherwise returns this.
   * @return A color in the HSL model.
   */
  abstract toHsl(clone?: boolean): HslColor;

  /**
   * Converts to the HSV model.
   * @param clone Whether to make a new clone if already is HSV. Otherwise returns this.
   * @return A color in the HSV model.
   */
  abstract toHsv(clone?: boolean): HsvColor;

  luminance(): number {
    const { r, g, b, alpha } = this.toRgb();
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) * alpha;
  }

  saturate(v: number): HslColor {
    const hsl = this.toHsl(true);
    hsl.s = clamp(hsl.s + v, 0, 1);
    return hsl;
  }

  desaturate(v: number): HslColor {
    const hsl = this.toHsl(true);
    hsl.s = clamp(hsl.s - v, 0, 1);
    return hsl;
  }

  lighten(v: number): HslColor {
    const hsl = this.toHsl(true);
    hsl.l = clamp(hsl.l + v, 0, 1);
    return hsl;
  }

  darken(v: number): HslColor {
    const hsl = this.toHsl(true);
    hsl.l = clamp(hsl.l - v, 0, 1);
    return hsl;
  }

  fadeIn(v: number): HslColor {
    const hsl = this.toHsl(true);
    hsl.alpha = clamp(hsl.alpha + v, 0, 1);
    return hsl;
  }

  fadeOut(v: number): HslColor {
    const hsl = this.toHsl(true);
    hsl.alpha = clamp(hsl.alpha - v, 0, 1);
    return hsl;
  }

  fade(v: number): HslColor {
    const hsl = this.toHsl(true);
    hsl.alpha = clamp(v, 0, 1);
    return hsl;
  }

  spin(v: number): HslColor {
    const hsl = this.toHsl(true);
    let h = hsl.h + v;
    if (h < 0) {
      h = -(h - Math.ceil(h));
    }
    if (h > 1) {
      h = h - Math.floor(h);
    }
    hsl.h = h;
    return hsl;
  }

  abstract format(): string;

  toString() {
    return this.format();
  }

  toJSON() {
    return this.toString();
  }
}
