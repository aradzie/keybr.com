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
  t.is(lr.remainingLessons, 3);
  t.is(lr.certainty, 0.9990293383742471);
});

test("increasing time", (t) => {
  const lr = LearningRate.from(
    generateKeySamples(5, {
      timeToTypeStart: 400,
      timeToTypeStep: -10,
    }),
  ) as LearningRate;
  t.is(lr.remainingLessons, NaN);
  t.is(lr.certainty, NaN);
});

test("non changing time", (t) => {
  const lr = LearningRate.from(
    generateKeySamples(5, {
      timeToTypeStart: 400,
      timeToTypeStep: 0,
    }),
  ) as LearningRate;
  t.is(lr.remainingLessons, NaN);
  t.is(lr.certainty, NaN);
});

test("example", (t) => {
  const lr = LearningRate.example();
  t.is(lr.remainingLessons, 3);
  t.is(lr.certainty, 0.9999384065091098);
});
