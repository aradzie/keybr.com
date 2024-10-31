import { test } from "node:test";
import { assert } from "chai";
import { resample } from "./util.ts";

test("resample", () => {
  assert.deepStrictEqual(resample([1, 2], 4), [1, 1, 2, 2]);
  assert.deepStrictEqual(resample([1, 1, 2, 2], 2), [1, 2]);
});
