import { deepStrictEqual, throws } from "node:assert/strict";
import { test } from "node:test";
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
  deepStrictEqual(
    { ...new HslColor(0.1, 0.2, 0.3) },
    { h: 0.1, s: 0.2, l: 0.3, a: 1 },
  );
  deepStrictEqual(
    { ...new HslColor(0.1, 0.2, 0.3, 0.4) },
    { h: 0.1, s: 0.2, l: 0.3, a: 0.4 },
  );
  deepStrictEqual(
    { ...new HslColor({ h: 0.1, s: 0.2, l: 0.3 }) },
    { h: 0.1, s: 0.2, l: 0.3, a: 1 },
  );
  deepStrictEqual(
    { ...new HslColor({ h: 0.1, s: 0.2, l: 0.3, a: 0.4 }) },
    { h: 0.1, s: 0.2, l: 0.3, a: 0.4 },
  );
});
