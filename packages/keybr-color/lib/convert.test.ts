import { deepEqual, equal } from "node:assert/strict";
import { test } from "node:test";
import { HslColor } from "./color-hsl.ts";
import { HsvColor } from "./color-hsv.ts";
import { RgbColor } from "./color-rgb.ts";
import { parseColor } from "./parse.ts";

test("roundtrip", () => {
  equal(
    parseColor("#000000")
      .toHsl()
      .toHsv()
      .toRgb()
      .toHsv()
      .toHsl()
      .toRgb()
      .formatHex(),
    "#000000",
  );
  equal(
    parseColor("#112233")
      .toHsl()
      .toHsv()
      .toRgb()
      .toHsv()
      .toHsl()
      .toRgb()
      .formatHex(),
    "#112233",
  );
  equal(
    parseColor("#ffffff")
      .toHsl()
      .toHsv()
      .toRgb()
      .toHsv()
      .toHsl()
      .toRgb()
      .formatHex(),
    "#ffffff",
  );
});

test("rgb to hsl", () => {
  equal(String(new RgbColor(0, 0, 0).toHsl()), "hsl(0,0%,0%)");
  equal(String(new RgbColor(1, 1, 1).toHsl()), "hsl(0,0%,100%)");
  equal(String(new RgbColor(1, 0, 0).toHsl()), "hsl(0,100%,50%)");
  equal(String(new RgbColor(0, 1, 0).toHsl()), "hsl(120,100%,50%)");
  equal(String(new RgbColor(0, 0, 1).toHsl()), "hsl(240,100%,50%)");
});

test("hsl to rgb", () => {
  equal(String(new HslColor(0, 0, 0).toRgb()), "rgb(0,0,0)");
  equal(String(new HslColor(0, 0, 1).toRgb()), "rgb(255,255,255)");
  equal(String(new HslColor(0, 1, 0.5).toRgb()), "rgb(255,0,0)");
  equal(String(new HslColor(120 / 360, 1, 0.5).toRgb()), "rgb(0,255,0)");
  equal(String(new HslColor(240 / 360, 1, 0.5).toRgb()), "rgb(0,0,255)");
});

test("hsl to hsv", () => {
  deepEqual({ ...new HslColor(0, 0, 0).toHsv() }, { h: 0, s: 0, v: 0, a: 1 });
  deepEqual(
    { ...new HslColor(0, 0, 0.5).toHsv() },
    { h: 0, s: 0, v: 0.5, a: 1 },
  );
  deepEqual({ ...new HslColor(1, 1, 1).toHsv() }, { h: 1, s: 0, v: 1, a: 1 });
});

test("hsv to hsl", () => {
  deepEqual({ ...new HsvColor(0, 0, 0).toHsl() }, { h: 0, s: 0, l: 0, a: 1 });
  deepEqual(
    { ...new HsvColor(0, 0, 0.5).toHsl() },
    { h: 0, s: 0, l: 0.5, a: 1 },
  );
  deepEqual({ ...new HsvColor(1, 1, 1).toHsl() }, { h: 1, s: 1, l: 0.5, a: 1 });
});
