import { Distribution } from "@keybr/math";
import data from "./dist.json";
import { bucketize, smooth } from "./util.ts";

export function makeSpeedDistribution(): Distribution {
  return new Distribution(
    bucketize(smooth(smooth(smooth(data, 3), 3), 3), 150),
  );
}
