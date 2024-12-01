import { test } from "node:test";
import { like, throws } from "rich-assert";
import { HwbColor } from "./color-hwb.ts";

test("construct", () => {
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new HwbColor(null);
  });
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new HwbColor("");
  });
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new HwbColor(0);
  });
  like(new HwbColor(0.1, 0.2, 0.3), { h: 0.1, w: 0.2, b: 0.3, alpha: 1 });
  like(new HwbColor(0.1, 0.2, 0.3, 0.4), { h: 0.1, w: 0.2, b: 0.3, alpha: 0.4 });
  like(new HwbColor({ h: 0.1, w: 0.2, b: 0.3, alpha: 0.4 }), { h: 0.1, w: 0.2, b: 0.3, alpha: 0.4 });
});
