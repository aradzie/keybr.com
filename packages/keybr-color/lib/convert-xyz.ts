import { OklabColor } from "./color-oklab.ts";
import { OklchColor } from "./color-oklch.ts";
import { RgbColor } from "./color-rgb.ts";
import { type Oklab, type Oklch, type Rgb, type Xyz } from "./types.ts";

const tmpRgb: Rgb = { r: 0, g: 0, b: 0, alpha: 0 };
const tmpXyz: Xyz = { x: 0, y: 0, z: 0, alpha: 0 };
const tmpOklab: Oklab = { l: 0, a: 0, b: 0, alpha: 0 };

const toLinear = (channel: number) =>
  channel <= 0.04045
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);

const toGamma = (channel: number) =>
  channel <= 0.0031308
    ? 12.92 * channel
    : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;

/**
 * Converts a gamma corrected sRGB color to a linear light form.
 */
export function rgbGammaToLinear(
  { r, g, b, alpha }: Readonly<Rgb>,
  to: Rgb,
): void {
  to.r = toLinear(r);
  to.g = toLinear(g);
  to.b = toLinear(b);
  to.alpha = alpha;
}

/**
 * Converts a linear-light sRGB color to a gamma corrected form.
 */
export function rgbLinearToGamma(
  { r, g, b, alpha }: Readonly<Rgb>,
  to: Rgb,
): void {
  to.r = toGamma(r);
  to.g = toGamma(g);
  to.b = toGamma(b);
  to.alpha = alpha;
}

/**
 * Converts a linear-light sRGB color to a CIE XYZ color using D65
 * (no chromatic adaptation).
 */
export function linearRgbToXyz(
  { r, g, b, alpha }: Readonly<Rgb>,
  to: Xyz,
): void {
  to.x =
    0.4123907992659595 * r + 0.35758433938387796 * g + 0.1804807884018343 * b;
  to.y =
    0.21263900587151036 * r + 0.7151686787677559 * g + 0.07219231536073371 * b;
  to.z =
    0.01933081871559185 * r + 0.11919477979462599 * g + 0.9505321522496606 * b;
  to.alpha = alpha;
}

/**
 * Converts a CIE XYZ color to a linear light sRGB color using D65
 * (no chromatic adaptation).
 */
export function xyzToLinearRgb(
  { x, y, z, alpha }: Readonly<Xyz>,
  to: Rgb,
): void {
  to.r =
    3.2409699419045213 * x + -1.5373831775700935 * y + -0.4986107602930033 * z;
  to.g =
    -0.9692436362808798 * x + 1.8759675015077206 * y + 0.04155505740717561 * z;
  to.b =
    0.05563007969699361 * x + -0.20397695888897657 * y + 1.0569715142428786 * z;
  to.alpha = alpha;
}

export function xyzToOklab({ x, y, z, alpha }: Readonly<Xyz>, to: Oklab): void {
  const L = Math.cbrt(
    0.819022437996703 * x + 0.3619062600528904 * y - 0.1288737815209879 * z,
  );
  const M = Math.cbrt(
    0.0329836539323885 * x + 0.9292868615863434 * y + 0.0361446663506424 * z,
  );
  const S = Math.cbrt(
    0.0481771893596242 * x + 0.2642395317527308 * y + 0.6335478284694309 * z,
  );
  to.l =
    0.210454268309314 * L + 0.7936177747023054 * M - 0.0040720430116193 * S;
  to.a =
    1.9779985324311684 * L - 2.4285922420485799 * M + 0.450593709617411 * S;
  to.b =
    0.0259040424655478 * L + 0.7827717124575296 * M - 0.8086757549230774 * S;
  to.alpha = alpha;
}

export function oklabToXyz({ l, a, b, alpha }: Readonly<Oklab>, to: Xyz): void {
  const L = Math.pow(l + 0.3963377773761749 * a + 0.2158037573099136 * b, 3);
  const M = Math.pow(l - 0.1055613458156586 * a - 0.0638541728258133 * b, 3);
  const S = Math.pow(l - 0.0894841775298119 * a - 1.2914855480194092 * b, 3);
  to.x =
    1.2268798758459243 * L - 0.5578149944602171 * M + 0.2813910456659647 * S;
  to.y =
    -0.0405757452148008 * L + 1.112286803280317 * M - 0.0717110580655164 * S;
  to.z =
    -0.0763729366746601 * L - 0.4214933324022432 * M + 1.5869240198367816 * S;
  to.alpha = alpha;
}

export function oklabToOklch(
  { l, a, b, alpha }: Readonly<Oklab>,
  to: Oklch,
): void {
  const c = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a) / Math.PI / 2;
  if (h < 0) {
    h = 1 + h;
  }
  to.l = l;
  to.c = c;
  to.h = h;
  to.alpha = alpha;
}

export function oklchToOklab(
  { l, c, h, alpha }: Readonly<Oklch>,
  to: Oklab,
): void {
  to.l = l;
  to.a = c * Math.cos(h * Math.PI * 2);
  to.b = c * Math.sin(h * Math.PI * 2);
  to.alpha = alpha;
}

export function rgbToOklab0(rgb: Readonly<Rgb>, to: Oklab): void {
  rgbGammaToLinear(rgb, tmpRgb);
  linearRgbToXyz(tmpRgb, tmpXyz);
  xyzToOklab(tmpXyz, to);
}

export function rgbToOklab(rgb: Readonly<Rgb>): OklabColor {
  const to = new OklabColor();
  rgbToOklab0(rgb, to);
  return to;
}

export function rgbToOklch0(rgb: Readonly<Rgb>, to: Oklch): void {
  rgbGammaToLinear(rgb, tmpRgb);
  linearRgbToXyz(tmpRgb, tmpXyz);
  xyzToOklab(tmpXyz, tmpOklab);
  oklabToOklch(tmpOklab, to);
}

export function rgbToOklch(rgb: Readonly<Rgb>): OklchColor {
  const to = new OklchColor();
  rgbToOklch0(rgb, to);
  return to;
}

export function oklabToRgb0(oklab: Readonly<Oklab>, to: RgbColor): void {
  oklabToXyz(oklab, tmpXyz);
  xyzToLinearRgb(tmpXyz, tmpRgb);
  rgbLinearToGamma(tmpRgb, to);
}

export function oklabToRgb(oklab: Readonly<Oklab>): RgbColor {
  const to = new RgbColor();
  oklabToRgb0(oklab, to);
  return to;
}

export function oklchToRgb0(oklch: Readonly<Oklch>, to: Rgb): void {
  oklchToOklab(oklch, tmpOklab);
  oklabToXyz(tmpOklab, tmpXyz);
  xyzToLinearRgb(tmpXyz, tmpRgb);
  rgbLinearToGamma(tmpRgb, to);
}

export function oklchToRgb(oklch: Readonly<Oklch>): RgbColor {
  const to = new RgbColor();
  oklchToRgb0(oklch, to);
  return to;
}
