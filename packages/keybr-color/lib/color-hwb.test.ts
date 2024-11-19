import { deepEqual, throws } from "node:assert/strict";
import { test } from "node:test";
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
  deepEqual(
    { ...new HwbColor(0.1, 0.2, 0.3) },
    { h: 0.1, w: 0.2, b: 0.3, a: 1 },
  );
  deepEqual(
    { ...new HwbColor(0.1, 0.2, 0.3, 0.4) },
    { h: 0.1, w: 0.2, b: 0.3, a: 0.4 },
  );
  deepEqual(
    { ...new HwbColor({ h: 0.1, w: 0.2, b: 0.3 }) },
    { h: 0.1, w: 0.2, b: 0.3, a: 1 },
  );
  deepEqual(
    { ...new HwbColor({ h: 0.1, w: 0.2, b: 0.3, a: 0.4 }) },
    { h: 0.1, w: 0.2, b: 0.3, a: 0.4 },
  );
});
