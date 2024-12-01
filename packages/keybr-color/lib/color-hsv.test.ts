import { test } from "node:test";
import { like, throws } from "rich-assert";
import { HsvColor } from "./color-hsv.ts";

test("construct", () => {
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new HsvColor(null);
  });
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new HsvColor("");
  });
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new HsvColor(0);
  });
  like(new HsvColor(0.1, 0.2, 0.3), { h: 0.1, s: 0.2, v: 0.3, alpha: 1 });
  like(new HsvColor(0.1, 0.2, 0.3, 0.4), { h: 0.1, s: 0.2, v: 0.3, alpha: 0.4 });
  like(new HsvColor({ h: 0.1, s: 0.2, v: 0.3, alpha: 0.4 }), { h: 0.1, s: 0.2, v: 0.3, alpha: 0.4 });
});
