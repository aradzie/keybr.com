import { test } from "node:test";
import { assert } from "chai";
import { makeAccuracyDistribution, makeSpeedDistribution } from "./dist.ts";

test("data size", () => {
  assert.strictEqual(makeSpeedDistribution().length, 751);
  assert.strictEqual(makeAccuracyDistribution().length, 1001);
});
