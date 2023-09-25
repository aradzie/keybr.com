import test from "ava";
import { LCG } from "./rng/lcg.ts";
import { randomSample, randomSamples, weightedRandomSample } from "./sample.ts";

test("sample random element", (t) => {
  t.is(randomSample([0]), 0);
  t.is(randomSample([0], LCG(0)), 0);
  t.is(randomSample([0, 1], LCG(0)), 1);
  t.is(randomSample([0, 1, 2], LCG(0)), 2);
  t.is(randomSample([0, 1, 2, 3], LCG(0)), 3);
});

test("sample weighted random element", (t) => {
  const a = { v: 1, w: 0 };
  const b = { v: 2, w: 0 };
  const c = { v: 3, w: 1 };
  const d = { v: 4, w: 0 };
  const e = { v: 5, w: 0 };
  t.is(
    weightedRandomSample([a, b, c, d, e], ({ w }) => w),
    c,
  );
  t.is(
    weightedRandomSample([a, b, c, d, e], ({ w }) => w, LCG(0)),
    c,
  );
});

test("sample unique random elements without replacement", (t) => {
  const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  t.deepEqual(randomSamples(list, 0), []);
  t.deepEqual(randomSamples(list, 0, LCG(0)), []);
  t.deepEqual(randomSamples(list, 1, LCG(0)), [8]);
  t.deepEqual(randomSamples(list, 2, LCG(0)), [8, 9]);
  t.deepEqual(randomSamples(list, 3, LCG(0)), [8, 9, 4]);
  t.deepEqual(randomSamples(list, 4, LCG(0)), [8, 9, 4, 2]);
  t.deepEqual(randomSamples(list, 5, LCG(0)), [8, 9, 4, 2, 6]);
  t.deepEqual(randomSamples(list, 6, LCG(0)), [8, 9, 4, 2, 6, 1]);
  t.deepEqual(randomSamples(list, 7, LCG(0)), [8, 9, 4, 2, 6, 1, 3]);
  t.deepEqual(randomSamples(list, 8, LCG(0)), [8, 9, 4, 2, 6, 1, 3, 0]);
  t.deepEqual(randomSamples(list, 9, LCG(0)), [8, 9, 4, 2, 6, 1, 3, 0, 5]);
  t.deepEqual(randomSamples(list, 10, LCG(0)), [8, 9, 4, 2, 6, 1, 3, 0, 5, 7]);
  t.deepEqual(randomSamples(list, 10, LCG(1)), [3, 4, 6, 7, 0, 9, 5, 1, 8, 2]);
});
