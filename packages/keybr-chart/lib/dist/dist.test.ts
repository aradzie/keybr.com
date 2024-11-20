import { test } from "node:test";
import { equal } from "rich-assert";
import { makeAccuracyDistribution, makeSpeedDistribution } from "./dist.ts";

test("data size", () => {
  equal(makeSpeedDistribution().length, 751);
  equal(makeAccuracyDistribution().length, 1001);
});
