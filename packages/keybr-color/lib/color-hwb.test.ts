import { throws } from "node:assert/strict";
import { test } from "node:test";
import { expect, use } from "chai";
import chaiLike from "chai-like";
import { HwbColor } from "./color-hwb.ts";

use(chaiLike);

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
  expect(new HwbColor(0.1, 0.2, 0.3)) //
    .to.be.like({ h: 0.1, w: 0.2, b: 0.3, a: 1 });
  expect(new HwbColor(0.1, 0.2, 0.3, 0.4)) //
    .to.be.like({ h: 0.1, w: 0.2, b: 0.3, a: 0.4 });
  expect(new HwbColor({ h: 0.1, w: 0.2, b: 0.3 })) //
    .to.be.like({ h: 0.1, w: 0.2, b: 0.3, a: 1 });
  expect(new HwbColor({ h: 0.1, w: 0.2, b: 0.3, a: 0.4 })) //
    .to.be.like({ h: 0.1, w: 0.2, b: 0.3, a: 0.4 });
});
