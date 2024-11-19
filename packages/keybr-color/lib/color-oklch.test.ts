import { throws } from "node:assert/strict";
import { test } from "node:test";
import { expect, use } from "chai";
import chaiLike from "chai-like";
import { OklchColor } from "./color-oklch.ts";

use(chaiLike);

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
  expect(new OklchColor(0.1, 0.2, 0.3)) //
    .to.be.like({ L: 0.1, C: 0.2, h: 0.3, a: 1 });
  expect(new OklchColor(0.1, 0.2, 0.3, 0.4)) //
    .to.be.like({ L: 0.1, C: 0.2, h: 0.3, a: 0.4 });
  expect(new OklchColor({ L: 0.1, C: 0.2, h: 0.3 })) //
    .to.be.like({ L: 0.1, C: 0.2, h: 0.3, a: 1 });
  expect(new OklchColor({ L: 0.1, C: 0.2, h: 0.3, a: 0.4 })) //
    .to.be.like({ L: 0.1, C: 0.2, h: 0.3, a: 0.4 });
});
