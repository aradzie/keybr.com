import { test } from "node:test";
import { assert } from "chai";
import { LCG } from "./rng/lcg.ts";
import { randomSample, randomSamples, weightedRandomSample } from "./sample.ts";

test("sample random element", () => {
  assert.strictEqual(randomSample([0]), 0);
  assert.strictEqual(randomSample([0], LCG(0)), 0);
  assert.strictEqual(randomSample([0, 1], LCG(0)), 1);
  assert.strictEqual(randomSample([0, 1, 2], LCG(0)), 2);
  assert.strictEqual(randomSample([0, 1, 2, 3], LCG(0)), 3);
});

test("sample weighted random element", () => {
  const a = { v: 1, w: 0 };
  const b = { v: 2, w: 0 };
  const c = { v: 3, w: 1 };
  const d = { v: 4, w: 0 };
  const e = { v: 5, w: 0 };
  assert.strictEqual(
    weightedRandomSample([a, b, c, d, e], ({ w }) => w),
    c,
  );
  assert.strictEqual(
    weightedRandomSample([a, b, c, d, e], ({ w }) => w, LCG(0)),
    c,
  );
});

test("sample unique random elements without replacement", () => {
  const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  assert.deepStrictEqual(randomSamples(list, 0), []);
  assert.deepStrictEqual(randomSamples(list, 0, LCG(0)), []);
  assert.deepStrictEqual(randomSamples(list, 1, LCG(0)), [8]);
  assert.deepStrictEqual(randomSamples(list, 2, LCG(0)), [8, 9]);
  assert.deepStrictEqual(randomSamples(list, 3, LCG(0)), [8, 9, 4]);
  assert.deepStrictEqual(randomSamples(list, 4, LCG(0)), [8, 9, 4, 2]);
  assert.deepStrictEqual(randomSamples(list, 5, LCG(0)), [8, 9, 4, 2, 6]);
  assert.deepStrictEqual(randomSamples(list, 6, LCG(0)), [8, 9, 4, 2, 6, 1]);
  assert.deepStrictEqual(randomSamples(list, 7, LCG(0)), [8, 9, 4, 2, 6, 1, 3]);
  assert.deepStrictEqual(
    randomSamples(list, 8, LCG(0)),
    [8, 9, 4, 2, 6, 1, 3, 0],
  );
  assert.deepStrictEqual(
    randomSamples(list, 9, LCG(0)),
    [8, 9, 4, 2, 6, 1, 3, 0, 5],
  );
  assert.deepStrictEqual(
    randomSamples(list, 10, LCG(0)),
    [8, 9, 4, 2, 6, 1, 3, 0, 5, 7],
  );
  assert.deepStrictEqual(
    randomSamples(list, 10, LCG(1)),
    [3, 4, 6, 7, 0, 9, 5, 1, 8, 2],
  );
});
