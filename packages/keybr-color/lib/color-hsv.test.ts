import { deepStrictEqual, throws } from "node:assert/strict";
import { test } from "node:test";
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
  deepStrictEqual(
    { ...new HsvColor(0.1, 0.2, 0.3) },
    { h: 0.1, s: 0.2, v: 0.3, a: 1 },
  );
  deepStrictEqual(
    { ...new HsvColor(0.1, 0.2, 0.3, 0.4) },
    { h: 0.1, s: 0.2, v: 0.3, a: 0.4 },
  );
  deepStrictEqual(
    { ...new HsvColor({ h: 0.1, s: 0.2, v: 0.3 }) },
    { h: 0.1, s: 0.2, v: 0.3, a: 1 },
  );
  deepStrictEqual(
    { ...new HsvColor({ h: 0.1, s: 0.2, v: 0.3, a: 0.4 }) },
    { h: 0.1, s: 0.2, v: 0.3, a: 0.4 },
  );
});
