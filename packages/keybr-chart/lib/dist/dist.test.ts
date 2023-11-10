import test from "ava";
import { newSpeedDistribution } from "./dist.ts";

test("data", (t) => {
  const { samples } = newSpeedDistribution();
  t.is(samples.length, 751);
});
