import { test } from "node:test";
import { equal, like, throws } from "rich-assert";
import { RgbColor } from "./color-rgb.ts";
import { hexColor } from "./parse.ts";

test("construct", () => {
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new RgbColor(null);
  });
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new RgbColor("");
  });
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new RgbColor(0);
  });
  like(new RgbColor(0.1, 0.2, 0.3), { r: 0.1, g: 0.2, b: 0.3, alpha: 1 });
  like(new RgbColor(0.1, 0.2, 0.3, 0.4), { r: 0.1, g: 0.2, b: 0.3, alpha: 0.4 });
  like(new RgbColor({ r: 0.1, g: 0.2, b: 0.3, alpha: 0.4 }), { r: 0.1, g: 0.2, b: 0.3, alpha: 0.4 });
});

test("hex", () => {
  like(hexColor(0x000000), { r: 0.0, g: 0.0, b: 0.0, alpha: 1.0 });
  like(hexColor(0xffffff), { r: 1.0, g: 1.0, b: 1.0, alpha: 1.0 });
  equal(hexColor(0x000000).hex(), 0x000000);
  equal(hexColor(0xaabbcc).hex(), 0xaabbcc);
});
