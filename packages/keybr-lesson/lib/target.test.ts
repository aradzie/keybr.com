import { Settings } from "@keybr/settings";
import test from "ava";
import { lessonProps } from "./settings.ts";
import { Target } from "./target.ts";

test("time to confidence", (t) => {
  const settings = new Settings().set(lessonProps.targetSpeed, /* 50WPM */ 250);
  const target = new Target(settings);
  t.throws(() => target.confidence(NaN));
  t.throws(() => target.confidence(0));
  t.is(target.confidence(1000 / (500 / 60)), 2.0);
  t.is(target.confidence(1000 / (250 / 60)), 1.0);
  t.is(target.confidence(1000 / (125 / 60)), 0.5);
});
