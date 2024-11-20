import { test } from "node:test";
import { deepEqual, equal } from "rich-assert";
import { LCG } from "./rng/lcg.ts";
import { randomSample, randomSamples, weightedRandomSample } from "./sample.ts";

test("sample random element", () => {
  equal(randomSample([0]), 0);
  equal(randomSample([0], LCG(0)), 0);
  equal(randomSample([0, 1], LCG(0)), 1);
  equal(randomSample([0, 1, 2], LCG(0)), 2);
  equal(randomSample([0, 1, 2, 3], LCG(0)), 3);
});

test("sample weighted random element", () => {
  const a = { v: 1, w: 0 };
  const b = { v: 2, w: 0 };
  const c = { v: 3, w: 1 };
  const d = { v: 4, w: 0 };
  const e = { v: 5, w: 0 };
  equal(
    weightedRandomSample([a, b, c, d, e], ({ w }) => w),
    c,
  );
  equal(
    weightedRandomSample([a, b, c, d, e], ({ w }) => w, LCG(0)),
    c,
  );
});

test("sample unique random elements without replacement", () => {
  const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  deepEqual(randomSamples(list, 0), []);
  deepEqual(randomSamples(list, 0, LCG(0)), []);
  deepEqual(randomSamples(list, 1, LCG(0)), [8]);
  deepEqual(randomSamples(list, 2, LCG(0)), [8, 9]);
  deepEqual(randomSamples(list, 3, LCG(0)), [8, 9, 4]);
  deepEqual(randomSamples(list, 4, LCG(0)), [8, 9, 4, 2]);
  deepEqual(randomSamples(list, 5, LCG(0)), [8, 9, 4, 2, 6]);
  deepEqual(randomSamples(list, 6, LCG(0)), [8, 9, 4, 2, 6, 1]);
  deepEqual(randomSamples(list, 7, LCG(0)), [8, 9, 4, 2, 6, 1, 3]);
  deepEqual(randomSamples(list, 8, LCG(0)), [8, 9, 4, 2, 6, 1, 3, 0]);
  deepEqual(randomSamples(list, 9, LCG(0)), [8, 9, 4, 2, 6, 1, 3, 0, 5]);
  deepEqual(randomSamples(list, 10, LCG(0)), [8, 9, 4, 2, 6, 1, 3, 0, 5, 7]);
  deepEqual(randomSamples(list, 10, LCG(1)), [3, 4, 6, 7, 0, 9, 5, 1, 8, 2]);
});
