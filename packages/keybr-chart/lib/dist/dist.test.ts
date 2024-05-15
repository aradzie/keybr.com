import test from "ava";
import { makeSpeedDistribution } from "./dist.ts";

test("data", (t) => {
  const { samples } = makeSpeedDistribution();
  t.is(samples.length, 751);
});
