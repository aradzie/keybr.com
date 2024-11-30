import { RgbColor } from "./color-rgb.ts";

const reHex3 = /^#([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})$/i;
const reHex4 = /^#([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})$/i;
const reHex6 = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i;
const reHex8 = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i;

export function parseHex(value: string): RgbColor | null {
  let m: RegExpMatchArray | null;
  if ((m = value.match(reHex3))) {
    const r = parseInt(m[1], 16);
    const g = parseInt(m[2], 16);
    const b = parseInt(m[3], 16);
    return new RgbColor(
      ((r << 4) | r) / 255,
      ((g << 4) | g) / 255,
      ((b << 4) | b) / 255,
    );
  }
  if ((m = value.match(reHex4))) {
    const r = parseInt(m[1], 16);
    const g = parseInt(m[2], 16);
    const b = parseInt(m[3], 16);
    const alpha = parseInt(m[4], 16);
    return new RgbColor(
      ((r << 4) | r) / 255,
      ((g << 4) | g) / 255,
      ((b << 4) | b) / 255,
      ((alpha << 4) | alpha) / 255,
    );
  }
  if ((m = value.match(reHex6))) {
    const r = parseInt(m[1], 16) / 255;
    const g = parseInt(m[2], 16) / 255;
    const b = parseInt(m[3], 16) / 255;
    return new RgbColor(r, g, b);
  }
  if ((m = value.match(reHex8))) {
    const r = parseInt(m[1], 16) / 255;
    const g = parseInt(m[2], 16) / 255;
    const b = parseInt(m[3], 16) / 255;
    const alpha = parseInt(m[4], 16) / 255;
    return new RgbColor(r, g, b, alpha);
  }
  return null;
}
