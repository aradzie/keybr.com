import test from "ava";
import { makeAccuracyDistribution, makeSpeedDistribution } from "./dist.ts";

test("data size", (t) => {
  t.is(makeSpeedDistribution().length, 751);
  t.is(makeAccuracyDistribution().length, 1001);
});
