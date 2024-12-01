import { test } from "node:test";
import { like, throws } from "rich-assert";
import { OklabColor } from "./color-oklab.ts";

test("construct", () => {
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new OklabColor(null);
  });
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new OklabColor("");
  });
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new OklabColor(0);
  });
  like(new OklabColor(0.1, 0.2, 0.3), { l: 0.1, a: 0.2, b: 0.3, alpha: 1 });
  like(new OklabColor(0.1, 0.2, 0.3, 0.4), { l: 0.1, a: 0.2, b: 0.3, alpha: 0.4 });
  like(new OklabColor({ l: 0.1, a: 0.2, b: 0.3, alpha: 0.4 }), { l: 0.1, a: 0.2, b: 0.3, alpha: 0.4 });
});
