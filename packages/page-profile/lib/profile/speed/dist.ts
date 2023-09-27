import { type Distribution, newDistribution } from "@keybr/math";
import data from "./dist.json";
import { bucketize, smooth } from "./util.ts";

export function newSpeedDistribution(): Distribution {
  return newDistribution(bucketize(smooth(smooth(smooth(data, 3), 3), 3), 150));
}
