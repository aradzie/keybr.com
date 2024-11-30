import { OklabColor } from "./color-oklab.ts";
import { OklchColor } from "./color-oklch.ts";
import { RgbColor } from "./color-rgb.ts";
import { type Oklab, type Oklch, type Rgb, type Xyz } from "./types.ts";

const tmpRgb: Rgb = { r: 0, g: 0, b: 0, a: 0 };
const tmpXyz: Xyz = { x: 0, y: 0, z: 0, a: 0 };
const tmpOklab: Oklab = { L: 0, A: 0, B: 0, a: 0 };

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
export function rgbGammaToLinear({ r, g, b, a }: Readonly<Rgb>, to: Rgb): void {
  to.r = toLinear(r);
  to.g = toLinear(g);
  to.b = toLinear(b);
  to.a = a;
}

/**
 * Converts a linear-light sRGB color to a gamma corrected form.
 */
export function rgbLinearToGamma({ r, g, b, a }: Readonly<Rgb>, to: Rgb): void {
  to.r = toGamma(r);
  to.g = toGamma(g);
  to.b = toGamma(b);
  to.a = a;
}

/**
 * Converts a linear-light sRGB color to a CIE XYZ color using D65
 * (no chromatic adaptation).
 */
export function linearRgbToXyz({ r, g, b, a }: Readonly<Rgb>, to: Xyz): void {
  to.x =
    0.4123907992659595 * r + 0.35758433938387796 * g + 0.1804807884018343 * b;
  to.y =
    0.21263900587151036 * r + 0.7151686787677559 * g + 0.07219231536073371 * b;
  to.z =
    0.01933081871559185 * r + 0.11919477979462599 * g + 0.9505321522496606 * b;
  to.a = a;
}

/**
 * Converts a CIE XYZ color to a linear light sRGB color using D65
 * (no chromatic adaptation).
 */
export function xyzToLinearRgb({ x, y, z, a }: Readonly<Xyz>, to: Rgb): void {
  to.r =
    3.2409699419045213 * x + -1.5373831775700935 * y + -0.4986107602930033 * z;
  to.g =
    -0.9692436362808798 * x + 1.8759675015077206 * y + 0.04155505740717561 * z;
  to.b =
    0.05563007969699361 * x + -0.20397695888897657 * y + 1.0569715142428786 * z;
  to.a = a;
}

export function xyzToOklab({ x, y, z, a }: Readonly<Xyz>, to: Oklab): void {
  const l = Math.cbrt(
    0.819022437996703 * x + 0.3619062600528904 * y - 0.1288737815209879 * z,
  );
  const m = Math.cbrt(
    0.0329836539323885 * x + 0.9292868615863434 * y + 0.0361446663506424 * z,
  );
  const s = Math.cbrt(
    0.0481771893596242 * x + 0.2642395317527308 * y + 0.6335478284694309 * z,
  );
  to.L =
    0.210454268309314 * l + 0.7936177747023054 * m - 0.0040720430116193 * s;
  to.A =
    1.9779985324311684 * l - 2.4285922420485799 * m + 0.450593709617411 * s;
  to.B =
    0.0259040424655478 * l + 0.7827717124575296 * m - 0.8086757549230774 * s;
  to.a = a;
}

export function oklabToXyz({ L, A, B, a }: Readonly<Oklab>, to: Xyz): void {
  const l = Math.pow(L + 0.3963377773761749 * A + 0.2158037573099136 * B, 3);
  const m = Math.pow(L - 0.1055613458156586 * A - 0.0638541728258133 * B, 3);
  const s = Math.pow(L - 0.0894841775298119 * A - 1.2914855480194092 * B, 3);
  to.x =
    1.2268798758459243 * l - 0.5578149944602171 * m + 0.2813910456659647 * s;
  to.y =
    -0.0405757452148008 * l + 1.112286803280317 * m - 0.0717110580655164 * s;
  to.z =
    -0.0763729366746601 * l - 0.4214933324022432 * m + 1.5869240198367816 * s;
  to.a = a;
}

export function oklabToOklch({ L, A, B, a }: Readonly<Oklab>, to: Oklch): void {
  const C = Math.sqrt(A * A + B * B);
  let h = Math.atan2(B, A) / Math.PI / 2;
  if (h < 0) {
    h = 1 + h;
  }
  to.L = L;
  to.C = C;
  to.h = h;
  to.a = a;
}

export function oklchToOklab({ L, C, h, a }: Readonly<Oklch>, to: Oklab): void {
  to.L = L;
  to.A = C * Math.cos(h * Math.PI * 2);
  to.B = C * Math.sin(h * Math.PI * 2);
  to.a = a;
}

export function rgbToOklab(rgb: Readonly<Rgb>): OklabColor {
  const to = new OklabColor();
  rgbGammaToLinear(rgb, tmpRgb);
  linearRgbToXyz(tmpRgb, tmpXyz);
  xyzToOklab(tmpXyz, to);
  return to;
}

export function rgbToOklch(rgb: Readonly<Rgb>): OklchColor {
  const to = new OklchColor();
  rgbGammaToLinear(rgb, tmpRgb);
  linearRgbToXyz(tmpRgb, tmpXyz);
  xyzToOklab(tmpXyz, tmpOklab);
  oklabToOklch(tmpOklab, to);
  return to;
}

export function oklabToRgb(oklab: Readonly<Oklab>): RgbColor {
  const to = new RgbColor();
  oklabToXyz(oklab, tmpXyz);
  xyzToLinearRgb(tmpXyz, tmpRgb);
  rgbLinearToGamma(tmpRgb, to);
  return to;
}

export function oklchToRgb(oklch: Readonly<Oklch>): RgbColor {
  const to = new RgbColor();
  oklchToOklab(oklch, tmpOklab);
  oklabToXyz(tmpOklab, tmpXyz);
  xyzToLinearRgb(tmpXyz, tmpRgb);
  rgbLinearToGamma(tmpRgb, to);
  return to;
}
