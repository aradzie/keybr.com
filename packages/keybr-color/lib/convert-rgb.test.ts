import { test } from "node:test";
import { equal, like } from "rich-assert";
import { HslColor } from "./color-hsl.ts";
import { HsvColor } from "./color-hsv.ts";
import { HwbColor } from "./color-hwb.ts";
import { RgbColor } from "./color-rgb.ts";
import { hslToHsv, hslToHwb, hslToRgb, hsvToHsl, hwbToHsl, hwbToRgb, rgbToHsl, rgbToHwb } from "./convert-rgb.ts";
import { parseColor } from "./parse.ts";

test("roundtrip", () => {
  equal(parseColor("#000000").toHsl().toHsv().toRgb().toHsv().toHsl().toRgb().formatHex(), "#000000");
  equal(parseColor("#112233").toHsl().toHsv().toRgb().toHsv().toHsl().toRgb().formatHex(), "#112233");
  equal(parseColor("#ffffff").toHsl().toHsv().toRgb().toHsv().toHsl().toRgb().formatHex(), "#ffffff");
});

test("rgb to hsl", () => {
  equal(String(rgbToHsl(new RgbColor(0, 0, 0))), "hsl(0 0% 0%)");
  equal(String(rgbToHsl(new RgbColor(1, 1, 1))), "hsl(0 0% 100%)");
  equal(String(rgbToHsl(new RgbColor(1, 0, 0))), "hsl(0 100% 50%)");
  equal(String(rgbToHsl(new RgbColor(0, 1, 0))), "hsl(120 100% 50%)");
  equal(String(rgbToHsl(new RgbColor(0, 0, 1))), "hsl(240 100% 50%)");
  equal(String(rgbToHsl(new RgbColor(0.5, 0.5, 0.5))), "hsl(0 0% 50%)");
});

test("hsl to rgb", () => {
  equal(String(hslToRgb(new HslColor(0, 0, 0))), "rgb(0 0 0)");
  equal(String(hslToRgb(new HslColor(0, 0, 1))), "rgb(255 255 255)");
  equal(String(hslToRgb(new HslColor(0, 1, 0.5))), "rgb(255 0 0)");
  equal(String(hslToRgb(new HslColor(120 / 360, 1, 0.5))), "rgb(0 255 0)");
  equal(String(hslToRgb(new HslColor(240 / 360, 1, 0.5))), "rgb(0 0 255)");
  equal(String(hslToRgb(new HslColor(0, 0, 0.5))), "rgb(128 128 128)");
});

test("rgb to hwb", () => {
  equal(String(rgbToHwb(new RgbColor(0, 0, 0))), "hwb(0 0% 100%)");
  equal(String(rgbToHwb(new RgbColor(1, 1, 1))), "hwb(0 100% 0%)");
  equal(String(rgbToHwb(new RgbColor(1, 0, 0))), "hwb(0 0% 0%)");
  equal(String(rgbToHwb(new RgbColor(0, 1, 0))), "hwb(120 0% 0%)");
  equal(String(rgbToHwb(new RgbColor(0, 0, 1))), "hwb(240 0% 0%)");
  equal(String(rgbToHwb(new RgbColor(0.5, 0.5, 0.5))), "hwb(0 50% 50%)");
});

test("hwb to rgb", () => {
  equal(String(hwbToRgb(new HwbColor(0, 0, 1))), "rgb(0 0 0)");
  equal(String(hwbToRgb(new HwbColor(0, 1, 0))), "rgb(255 255 255)");
  equal(String(hwbToRgb(new HwbColor(0, 0, 0))), "rgb(255 0 0)");
  equal(String(hwbToRgb(new HwbColor(120 / 360, 0, 0))), "rgb(0 255 0)");
  equal(String(hwbToRgb(new HwbColor(240 / 360, 0, 0))), "rgb(0 0 255)");
  equal(String(hwbToRgb(new HwbColor(0, 0.5, 0.5))), "rgb(128 128 128)");
  equal(String(hwbToRgb(new HwbColor(0, 1, 1))), "rgb(128 128 128)");
});

test("hsl to hwb", () => {
  equal(String(hslToHwb(new HslColor(0, 0, 0))), "hwb(0 0% 100%)");
  equal(String(hslToHwb(new HslColor(0, 0, 1))), "hwb(0 100% 0%)");
  equal(String(hslToHwb(new HslColor(0, 1, 0.5))), "hwb(0 0% 0%)");
  equal(String(hslToHwb(new HslColor(120 / 360, 1, 0.5))), "hwb(120 0% 0%)");
  equal(String(hslToHwb(new HslColor(240 / 360, 1, 0.5))), "hwb(240 0% 0%)");
});

test("hwb to hsl", () => {
  equal(String(hwbToHsl(new HwbColor(0, 0, 1))), "hsl(0 0% 0%)");
  equal(String(hwbToHsl(new HwbColor(0, 1, 0))), "hsl(0 0% 100%)");
  equal(String(hwbToHsl(new HwbColor(0, 0, 0))), "hsl(0 100% 50%)");
  equal(String(hwbToHsl(new HwbColor(120 / 360, 0, 0))), "hsl(120 100% 50%)");
  equal(String(hwbToHsl(new HwbColor(240 / 360, 0, 0))), "hsl(240 100% 50%)");
});

test("hsl to hsv", () => {
  like(hslToHsv(new HslColor(0, 0, 0)), { h: 0, s: 0, v: 0, alpha: 1 });
  like(hslToHsv(new HslColor(0, 0, 0.5)), { h: 0, s: 0, v: 0.5, alpha: 1 });
  like(hslToHsv(new HslColor(0, 1, 1)), { h: 0, s: 0, v: 1, alpha: 1 });
});

test("hsv to hsl", () => {
  like(hsvToHsl(new HsvColor(0, 0, 0)), { h: 0, s: 0, l: 0, alpha: 1 });
  like(hsvToHsl(new HsvColor(0, 0, 0.5)), { h: 0, s: 0, l: 0.5, alpha: 1 });
  like(hsvToHsl(new HsvColor(0, 1, 1)), { h: 0, s: 1, l: 0.5, alpha: 1 });
});
