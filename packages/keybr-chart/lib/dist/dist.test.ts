import test from "ava";
import { makeSpeedDistribution } from "./dist.ts";

test("data", (t) => {
  t.is(makeSpeedDistribution().length, 751);
});
