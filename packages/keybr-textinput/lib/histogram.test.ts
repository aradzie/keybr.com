import test from "ava";
import { Histogram } from "./histogram.ts";

const A = /* "a" */ 0x0061;
const B = /* "b" */ 0x0062;
const C = /* "c" */ 0x0063;
const X = /* "x" */ 0x0078;

test("empty histogram", (t) => {
  const histogram = Histogram.from([]);

  t.is(histogram.complexity, 0);
  t.deepEqual([...histogram], []);
});

test("histogram", (t) => {
  const histogram = Histogram.from([
    { timeStamp: 100, codePoint: A, timeToType: 100.1, typo: false },
    { timeStamp: 200, codePoint: B, timeToType: 100.1, typo: false },
    { timeStamp: 300, codePoint: C, timeToType: 100.1, typo: false },
    { timeStamp: 600, codePoint: A, timeToType: 300.1, typo: false },
    { timeStamp: 700, codePoint: A, timeToType: 100.1, typo: true },
    { timeStamp: 801, codePoint: X, timeToType: 1, typo: false }, // Invalid step.
  ]);

  t.is(histogram.complexity, 3);
  t.deepEqual(
    [...histogram],
    [
      { codePoint: A, hitCount: 3, missCount: 1, timeToType: 200 },
      { codePoint: B, hitCount: 1, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 1, missCount: 0, timeToType: 100 },
    ],
  );
});

test("ignore typos", (t) => {
  const histogram = Histogram.from([
    { timeStamp: 100, codePoint: A, timeToType: 100.1, typo: true },
    { timeStamp: 200, codePoint: B, timeToType: 100.1, typo: true },
    { timeStamp: 300, codePoint: C, timeToType: 100.1, typo: true },
    { timeStamp: 301, codePoint: X, timeToType: 1, typo: false }, // Invalid step.
  ]);

  t.is(histogram.complexity, 3);
  t.deepEqual(
    [...histogram],
    [
      { codePoint: A, hitCount: 1, missCount: 1, timeToType: 0 },
      { codePoint: B, hitCount: 1, missCount: 1, timeToType: 0 },
      { codePoint: C, hitCount: 1, missCount: 1, timeToType: 0 },
    ],
  );
});

test("validate histogram", (t) => {
  // Too few characters.

  t.false(new Histogram([]).validate());

  t.false(
    new Histogram([
      { codePoint: A, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 10, missCount: 0, timeToType: 100 },
    ]).validate(),
  );

  // Too slow.

  t.false(
    new Histogram([
      { codePoint: A, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 10, missCount: 0, timeToType: 12001 },
    ]).validate(),
  );

  // Too fast.

  t.false(
    new Histogram([
      { codePoint: A, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 10, missCount: 0, timeToType: 39 },
    ]).validate(),
  );

  // Valid.

  t.true(
    new Histogram([
      { codePoint: A, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 10, missCount: 0, timeToType: 40 },
    ]).validate(),
  );

  t.true(
    new Histogram([
      { codePoint: A, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 10, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 10, missCount: 0, timeToType: 12000 },
    ]).validate(),
  );

  t.true(
    new Histogram([
      { codePoint: A, hitCount: 10, missCount: 10, timeToType: 0 },
      { codePoint: B, hitCount: 10, missCount: 10, timeToType: 0 },
      { codePoint: C, hitCount: 10, missCount: 10, timeToType: 0 },
    ]).validate(),
  );
});
