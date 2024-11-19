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
  like(new OklabColor(0.1, 0.2, 0.3), { L: 0.1, A: 0.2, B: 0.3, a: 1 });
  like(new OklabColor(0.1, 0.2, 0.3, 0.4), { L: 0.1, A: 0.2, B: 0.3, a: 0.4 });
  like(new OklabColor({ L: 0.1, A: 0.2, B: 0.3 }), { L: 0.1, A: 0.2, B: 0.3, a: 1 });
  like(new OklabColor({ L: 0.1, A: 0.2, B: 0.3, a: 0.4 }), { L: 0.1, A: 0.2, B: 0.3, a: 0.4 });
});
