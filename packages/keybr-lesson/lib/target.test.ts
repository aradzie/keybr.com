import { test } from "node:test";
import { Settings } from "@keybr/settings";
import { equal, throws } from "rich-assert";
import { lessonProps } from "./settings.ts";
import { Target } from "./target.ts";

test("time to confidence", () => {
  const settings = new Settings().set(lessonProps.targetSpeed, /* 50WPM */ 250);
  const target = new Target(settings);
  throws(() => target.confidence(NaN));
  throws(() => target.confidence(0));
  equal(target.confidence(1000 / (500 / 60)), 2.0);
  equal(target.confidence(1000 / (250 / 60)), 1.0);
  equal(target.confidence(1000 / (125 / 60)), 0.5);
});
