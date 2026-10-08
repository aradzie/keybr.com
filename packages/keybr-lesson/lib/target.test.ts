import { test } from "node:test";
import { Letter } from "@keybr/phonetic-model";
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

test("per-letter target speed", () => {
  const letterA = new Letter(/* "a" */ 0x0061, 1);
  const letterB = new Letter(/* "b" */ 0x0062, 1);
  const settings = new Settings()
    .set(lessonProps.targetSpeed, /* 50WPM */ 250)
    .set(lessonProps.letterTargetSpeed, new Map([["a", /* 25WPM */ 125]]));
  const target = new Target(settings);
  equal(target.targetSpeed, 250);
  equal(target.forLetter(letterA).targetSpeed, 125);
  equal(target.forLetter(letterB).targetSpeed, 250);
  equal(new Target(settings, letterA).targetSpeed, 125);
  equal(target.forLetter(letterA).confidence(1000 / (125 / 60)), 1.0);
  equal(target.forLetter(letterB).confidence(1000 / (125 / 60)), 0.5);
});
