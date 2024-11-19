import { throws } from "node:assert/strict";
import { test } from "node:test";
import { expect, use } from "chai";
import chaiLike from "chai-like";
import { HslColor } from "./color-hsl.ts";

use(chaiLike);

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
  expect(new HslColor(0.1, 0.2, 0.3)) //
    .to.be.like({ h: 0.1, s: 0.2, l: 0.3, a: 1 });
  expect(new HslColor(0.1, 0.2, 0.3, 0.4)) //
    .to.be.like({ h: 0.1, s: 0.2, l: 0.3, a: 0.4 });
  expect(new HslColor({ h: 0.1, s: 0.2, l: 0.3 })) //
    .to.be.like({ h: 0.1, s: 0.2, l: 0.3, a: 1 });
  expect(new HslColor({ h: 0.1, s: 0.2, l: 0.3, a: 0.4 })) //
    .to.be.like({ h: 0.1, s: 0.2, l: 0.3, a: 0.4 });
});
