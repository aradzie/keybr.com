import { generateKeySamples } from "@keybr/result";
import test from "ava";
import { LearningRate } from "./learningrate.ts";

test("too few samples", (t) => {
  t.is(LearningRate.from([]), null);
  t.is(LearningRate.from(generateKeySamples(0)), null);
  t.is(LearningRate.from(generateKeySamples(1)), null);
  t.is(LearningRate.from(generateKeySamples(2)), null);
  t.is(LearningRate.from(generateKeySamples(3)), null);
  t.is(LearningRate.from(generateKeySamples(4)), null);
  t.not(LearningRate.from(generateKeySamples(5)), null);
});

test("decreasing time", (t) => {
  const lr = LearningRate.from(
    generateKeySamples(5, {
      timeToTypeStart: 400,
      timeToTypeStep: +10,
    }),
  ) as LearningRate;
  t.is(lr.certainty, 0.9990293383742471);
  t.is(lr.learningRate, 4.164934164934164);
  t.is(lr.remainingLessons, 3);
});

test("increasing time", (t) => {
  const lr = LearningRate.from(
    generateKeySamples(5, {
      timeToTypeStart: 400,
      timeToTypeStep: -10,
    }),
  ) as LearningRate;
  t.is(lr.certainty, 0.9992055903829036);
  t.is(lr.learningRate, -3.4079306966431178);
  t.is(lr.remainingLessons, NaN);
});

test("learning rate of the example data", (t) => {
  const lr = LearningRate.example();
  t.is(lr.certainty, 0.9999384065091098);
  t.is(lr.learningRate, 4.234223847240317);
  t.is(lr.remainingLessons, 3);
});
