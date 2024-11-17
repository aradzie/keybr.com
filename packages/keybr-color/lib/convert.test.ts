import { strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { HslColor } from "./color-hsl.ts";
import { RgbColor } from "./color-rgb.ts";
import { parseColor } from "./parse.ts";

test("convert", () => {
  strictEqual(
    parseColor("#112233").toHsl().toRgb().toHsl().toRgb().formatHex(),
    "#112233",
  );
  strictEqual(new RgbColor(0, 0, 0).toHsl().format(), "hsl(0,0%,0%)");
  strictEqual(new RgbColor(1, 1, 1).toHsl().format(), "hsl(0,0%,100%)");
  strictEqual(new HslColor(0, 0, 0).toRgb().format(), "rgb(0,0,0)");
  strictEqual(new HslColor(0, 0, 1).toRgb().format(), "rgb(255,255,255)");
});
