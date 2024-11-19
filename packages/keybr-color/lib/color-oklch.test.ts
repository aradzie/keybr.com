import { test } from "node:test";
import { like, throws } from "rich-assert";
import { OklchColor } from "./color-oklch.ts";

test("construct", () => {
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new OklchColor(null);
  });
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new OklchColor("");
  });
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new OklchColor(0);
  });
  like(new OklchColor(0.1, 0.2, 0.3), { L: 0.1, C: 0.2, h: 0.3, a: 1 });
  like(new OklchColor(0.1, 0.2, 0.3, 0.4), { L: 0.1, C: 0.2, h: 0.3, a: 0.4 });
  like(new OklchColor({ L: 0.1, C: 0.2, h: 0.3 }), { L: 0.1, C: 0.2, h: 0.3, a: 1 });
  like(new OklchColor({ L: 0.1, C: 0.2, h: 0.3, a: 0.4 }), { L: 0.1, C: 0.2, h: 0.3, a: 0.4 });
});
