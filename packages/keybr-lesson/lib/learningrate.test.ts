import { test } from "node:test";
import { generateKeySamples } from "@keybr/result";
import { Settings } from "@keybr/settings";
import { assert } from "chai";
import { LearningRate } from "./learningrate.ts";
import { lessonProps } from "./settings.ts";
import { Target } from "./target.ts";

test("too few samples", () => {
  const settings = new Settings().set(lessonProps.targetSpeed, /* 35WPM */ 175);
  const target = new Target(settings);
  assert.isNull(LearningRate.from([], target));
  assert.isNull(LearningRate.from(generateKeySamples(0), target));
  assert.isNull(LearningRate.from(generateKeySamples(1), target));
  assert.isNull(LearningRate.from(generateKeySamples(2), target));
  assert.isNull(LearningRate.from(generateKeySamples(3), target));
  assert.isNull(LearningRate.from(generateKeySamples(4), target));
  assert.isNotNull(LearningRate.from(generateKeySamples(5), target));
});

test("decreasing time", () => {
  const settings = new Settings().set(lessonProps.targetSpeed, /* 35WPM */ 175);
  const target = new Target(settings);
  const learningRate = LearningRate.from(
    generateKeySamples(5, {
      timeToTypeStart: 400,
      timeToTypeStep: +10,
    }),
    target,
  ) as LearningRate;
  assert.strictEqual(learningRate.certainty, 0.9990293383742471);
  assert.strictEqual(learningRate.learningRate, 4.164934164934164);
  assert.strictEqual(learningRate.remainingLessons, 3);
});

test("increasing time", () => {
  const settings = new Settings().set(lessonProps.targetSpeed, /* 35WPM */ 175);
  const target = new Target(settings);
  const learningRate = LearningRate.from(
    generateKeySamples(5, {
      timeToTypeStart: 400,
      timeToTypeStep: -10,
    }),
    target,
  ) as LearningRate;
  assert.strictEqual(learningRate.certainty, 0.9992055903829036);
  assert.strictEqual(learningRate.learningRate, -3.4079306966431178);
  assert.isNaN(learningRate.remainingLessons);
});

test("learning rate of the example data", () => {
  const settings = new Settings().set(lessonProps.targetSpeed, /* 35WPM */ 175);
  const target = new Target(settings);
  const learningRate = LearningRate.example(target);
  assert.strictEqual(learningRate.certainty, 0.9999559701751027);
  assert.strictEqual(learningRate.learningRate, 4.1890206530121485);
  assert.strictEqual(learningRate.remainingLessons, 3);
});
