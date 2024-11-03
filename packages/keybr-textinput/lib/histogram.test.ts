import { test } from "node:test";
import { assert } from "chai";
import { Histogram } from "./histogram.ts";

const A = /* "a" */ 0x0061;
const B = /* "b" */ 0x0062;
const C = /* "c" */ 0x0063;
const X = /* "x" */ 0x0078;

test("empty histogram", () => {
  const histogram = Histogram.from([]);

  assert.strictEqual(histogram.complexity, 0);
  assert.deepStrictEqual([...histogram], []);
});

test("histogram", () => {
  const histogram = Histogram.from([
    { timeStamp: 100, codePoint: A, timeToType: 100.1, typo: false },
    { timeStamp: 200, codePoint: B, timeToType: 100.1, typo: false },
    { timeStamp: 300, codePoint: C, timeToType: 100.1, typo: false },
    { timeStamp: 600, codePoint: A, timeToType: 300.1, typo: false },
    { timeStamp: 700, codePoint: A, timeToType: 100.1, typo: true },
    { timeStamp: 801, codePoint: X, timeToType: 1, typo: false }, // Invalid step.
  ]);

  assert.strictEqual(histogram.complexity, 3);
  assert.deepStrictEqual(
    [...histogram],
    [
      { codePoint: A, hitCount: 3, missCount: 1, timeToType: 200 },
      { codePoint: B, hitCount: 1, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 1, missCount: 0, timeToType: 100 },
    ],
  );
});

test("ignore typos", () => {
  const histogram = Histogram.from([
    { timeStamp: 100, codePoint: A, timeToType: 100.1, typo: true },
    { timeStamp: 200, codePoint: B, timeToType: 100.1, typo: true },
    { timeStamp: 300, codePoint: C, timeToType: 100.1, typo: true },
    { timeStamp: 301, codePoint: X, timeToType: 1, typo: false }, // Invalid step.
  ]);

  assert.strictEqual(histogram.complexity, 3);
  assert.deepStrictEqual(
    [...histogram],
    [
      { codePoint: A, hitCount: 1, missCount: 1, timeToType: 0 },
      { codePoint: B, hitCount: 1, missCount: 1, timeToType: 0 },
      { codePoint: C, hitCount: 1, missCount: 1, timeToType: 0 },
    ],
  );
});

test("validate histogram", () => {
  // Too few characters.

  assert.isFalse(new Histogram([]).validate());

  assert.isFalse(
    new Histogram([
      { codePoint: A, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 10, missCount: 0, timeToType: 100 },
    ]).validate(),
  );

  // Too slow.

  assert.isFalse(
    new Histogram([
      { codePoint: A, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 10, missCount: 0, timeToType: 12001 },
    ]).validate(),
  );

  // Too fast.

  assert.isFalse(
    new Histogram([
      { codePoint: A, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 10, missCount: 0, timeToType: 39 },
    ]).validate(),
  );

  // Valid.

  assert.isTrue(
    new Histogram([
      { codePoint: A, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 10, missCount: 0, timeToType: 40 },
    ]).validate(),
  );

  assert.isTrue(
    new Histogram([
      { codePoint: A, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 10, missCount: 0, timeToType: 12000 },
    ]).validate(),
  );

  assert.isTrue(
    new Histogram([
      { codePoint: A, hitCount: 10, missCount: 10, timeToType: 0 },
      { codePoint: B, hitCount: 10, missCount: 10, timeToType: 0 },
      { codePoint: C, hitCount: 10, missCount: 10, timeToType: 0 },
    ]).validate(),
  );
});
