import { RgbColor } from "@keybr/widget";
import test from "ava";
import { confidenceColor } from "./color.ts";

test("color", (t) => {
  t.deepEqual(
    confidenceColor(2.0),
    new RgbColor(0.3764705882352941, 0.8431372549019608, 0.5333333333333333),
  );
  t.deepEqual(
    confidenceColor(1.0),
    new RgbColor(0.3764705882352941, 0.8431372549019608, 0.5333333333333333),
  );
  t.deepEqual(confidenceColor(0.0), new RgbColor(0.8, 0.0, 0.0));
});
