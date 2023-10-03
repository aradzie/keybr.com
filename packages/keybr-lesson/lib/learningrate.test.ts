import { generateKeySamples } from "@keybr/result";
import test from "ava";
import { LearningRate } from "./learningrate.ts";
import { Target } from "./target.ts";

test("too few samples", (t) => {
  const target = new Target({ targetSpeed: /* 35WPM */ 175 });
  t.is(LearningRate.from([], target), null);
  t.is(LearningRate.from(generateKeySamples(0), target), null);
  t.is(LearningRate.from(generateKeySamples(1), target), null);
  t.is(LearningRate.from(generateKeySamples(2), target), null);
  t.is(LearningRate.from(generateKeySamples(3), target), null);
  t.is(LearningRate.from(generateKeySamples(4), target), null);
  t.not(LearningRate.from(generateKeySamples(5), target), null);
});

test("decreasing time", (t) => {
  const target = new Target({ targetSpeed: /* 35WPM */ 175 });
  const learningRate = LearningRate.from(
    generateKeySamples(5, {
      timeToTypeStart: 400,
      timeToTypeStep: +10,
    }),
    target,
  ) as LearningRate;
  t.is(learningRate.certainty, 0.9990293383742471);
  t.is(learningRate.learningRate, 4.164934164934164);
  t.is(learningRate.remainingLessons, 3);
});

test("increasing time", (t) => {
  const target = new Target({ targetSpeed: /* 35WPM */ 175 });
  const learningRate = LearningRate.from(
    generateKeySamples(5, {
      timeToTypeStart: 400,
      timeToTypeStep: -10,
    }),
    target,
  ) as LearningRate;
  t.is(learningRate.certainty, 0.9992055903829036);
  t.is(learningRate.learningRate, -3.4079306966431178);
  t.is(learningRate.remainingLessons, NaN);
});

test("learning rate of the example data", (t) => {
  const target = new Target({ targetSpeed: /* 35WPM */ 175 });
  const learningRate = LearningRate.example(target);
  t.is(learningRate.certainty, 0.9999559701751027);
  t.is(learningRate.learningRate, 4.1890206530121485);
  t.is(learningRate.remainingLessons, 3);
});
