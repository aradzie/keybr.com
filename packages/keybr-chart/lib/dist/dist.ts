import { type Distribution, makeDistribution } from "@keybr/math";
import data from "./dist.json";
import { bucketize, smooth } from "./util.ts";

export function makeSpeedDistribution(): Distribution {
  return makeDistribution(
    bucketize(smooth(smooth(smooth(data, 3), 3), 3), 150),
  );
}
