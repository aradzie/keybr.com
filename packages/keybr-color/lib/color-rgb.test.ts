import { equal, throws } from "node:assert/strict";
import { test } from "node:test";
import { expect, use } from "chai";
import chaiLike from "chai-like";
import { RgbColor } from "./color-rgb.ts";
import { hexColor } from "./parse.ts";

use(chaiLike);

test("construct", () => {
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new RgbColor(null);
  });
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new RgbColor("");
  });
  throws(() => {
    // @ts-expect-error Test invalid arguments.
    new RgbColor(0);
  });
  expect(new RgbColor(0.1, 0.2, 0.3)) //
    .to.be.like({ r: 0.1, g: 0.2, b: 0.3, a: 1 });
  expect(new RgbColor(0.1, 0.2, 0.3, 0.4)) //
    .to.be.like({ r: 0.1, g: 0.2, b: 0.3, a: 0.4 });
  expect(new RgbColor({ r: 0.1, g: 0.2, b: 0.3 })) //
    .to.be.like({ r: 0.1, g: 0.2, b: 0.3, a: 1 });
  expect(new RgbColor({ r: 0.1, g: 0.2, b: 0.3, a: 0.4 })) //
    .to.be.like({ r: 0.1, g: 0.2, b: 0.3, a: 0.4 });
});

test("hex", () => {
  expect(hexColor(0x000000)).to.be.like({ r: 0.0, g: 0.0, b: 0.0, a: 1.0 });
  expect(hexColor(0xffffff)).to.be.like({ r: 1.0, g: 1.0, b: 1.0, a: 1.0 });
  equal(hexColor(0x000000).hex(), 0x000000);
  equal(hexColor(0xaabbcc).hex(), 0xaabbcc);
});
