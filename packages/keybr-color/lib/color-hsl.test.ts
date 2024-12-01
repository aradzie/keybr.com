import { test } from "node:test";
import { like, throws } from "rich-assert";
import { HslColor } from "./color-hsl.ts";

test("construct", () => {
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new HslColor(null);
  });
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new HslColor("");
  });
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new HslColor(0);
  });
  like(new HslColor(0.1, 0.2, 0.3), { h: 0.1, s: 0.2, l: 0.3, alpha: 1 });
  like(new HslColor(0.1, 0.2, 0.3, 0.4), { h: 0.1, s: 0.2, l: 0.3, alpha: 0.4 });
  like(new HslColor({ h: 0.1, s: 0.2, l: 0.3, alpha: 0.4 }), { h: 0.1, s: 0.2, l: 0.3, alpha: 0.4 });
});
