import { throws } from "node:assert/strict";
import { test } from "node:test";
import { expect, use } from "chai";
import chaiLike from "chai-like";
import { OklabColor } from "./color-oklab.ts";

use(chaiLike);

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
  expect(new OklabColor(0.1, 0.2, 0.3)) //
    .to.be.like({ L: 0.1, A: 0.2, B: 0.3, a: 1 });
  expect(new OklabColor(0.1, 0.2, 0.3, 0.4)) //
    .to.be.like({ L: 0.1, A: 0.2, B: 0.3, a: 0.4 });
  expect(new OklabColor({ L: 0.1, A: 0.2, B: 0.3 })) //
    .to.be.like({ L: 0.1, A: 0.2, B: 0.3, a: 1 });
  expect(new OklabColor({ L: 0.1, A: 0.2, B: 0.3, a: 0.4 })) //
    .to.be.like({ L: 0.1, A: 0.2, B: 0.3, a: 0.4 });
});
