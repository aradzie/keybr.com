import { test } from "node:test";
import { Settings } from "@keybr/settings";
import { assert } from "chai";
import { lessonProps } from "./settings.ts";
import { Target } from "./target.ts";

test("time to confidence", () => {
  const settings = new Settings().set(lessonProps.targetSpeed, /* 50WPM */ 250);
  const target = new Target(settings);
  assert.throws(() => target.confidence(NaN));
  assert.throws(() => target.confidence(0));
  assert.strictEqual(target.confidence(1000 / (500 / 60)), 2.0);
  assert.strictEqual(target.confidence(1000 / (250 / 60)), 1.0);
  assert.strictEqual(target.confidence(1000 / (125 / 60)), 0.5);
});
