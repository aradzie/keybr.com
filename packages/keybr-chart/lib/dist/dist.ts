import { Distribution } from "@keybr/math";
import accuracy from "./dist_accuracy.json" with { type: "json" };
import speed from "./dist_speed.json" with { type: "json" };
import { bucketize, smooth } from "./util.ts";

export function makeSpeedDistribution(): Distribution {
  return new Distribution(
    bucketize(smooth(smooth(smooth(speed, 5), 5), 5), 150),
  );
}

export function makeAccuracyDistribution(): Distribution {
  return new Distribution(smooth(smooth(smooth(accuracy, 5), 5), 5));
}
