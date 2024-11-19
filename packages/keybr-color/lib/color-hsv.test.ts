import { throws } from "node:assert/strict";
import { test } from "node:test";
import { expect, use } from "chai";
import chaiLike from "chai-like";
import { HsvColor } from "./color-hsv.ts";

use(chaiLike);

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
  expect(new HsvColor(0.1, 0.2, 0.3)) //
    .to.be.like({ h: 0.1, s: 0.2, v: 0.3, a: 1 });
  expect(new HsvColor(0.1, 0.2, 0.3, 0.4)) //
    .to.be.like({ h: 0.1, s: 0.2, v: 0.3, a: 0.4 });
  expect(new HsvColor({ h: 0.1, s: 0.2, v: 0.3 })) //
    .to.be.like({ h: 0.1, s: 0.2, v: 0.3, a: 1 });
  expect(new HsvColor({ h: 0.1, s: 0.2, v: 0.3, a: 0.4 })) //
    .to.be.like({ h: 0.1, s: 0.2, v: 0.3, a: 0.4 });
});
