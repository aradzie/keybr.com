import { strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { mixColors } from "./mix.ts";
import { hexColor } from "./parse.ts";

test("mix", () => {
  const a = hexColor(0x0080ff);
  const b = hexColor(0xff8000);
  strictEqual(mixColors(a, b, -100.0).hex(), 0x0080ff);
  strictEqual(mixColors(a, b, 0.0).hex(), 0x0080ff);
  strictEqual(mixColors(a, b, 0.5).hex(), 0x808080);
  strictEqual(mixColors(a, b, 1.0).hex(), 0xff8000);
  strictEqual(mixColors(a, b, 100.0).hex(), 0xff8000);
});
