import test from "ava";
import { Histogram } from "./histogram.ts";

const A = 0x0061;
const B = 0x0062;
const C = 0x0063;
const X = 0x0078;

test("build empty histogram", (t) => {
  const histogram = Histogram.from([]);

  t.is(histogram.complexity, 0);
  t.deepEqual([...histogram], []);
});

test("build histogram from single step", (t) => {
  const histogram = Histogram.from([
    { codePoint: A, timeStamp: 200, typo: false },
  ]);

  t.is(histogram.complexity, 1);
  t.deepEqual(
    [...histogram],
    [{ codePoint: A, hitCount: 1, missCount: 0, timeToType: 0 }],
  );
});

test("build histogram from single step with started at", (t) => {
  const histogram = Histogram.from(
    [
      { codePoint: A, timeStamp: 200, typo: false },
      { codePoint: X, timeStamp: 201, typo: false }, // Invalid step.
    ],
    { startedAt: 100 },
  );

  t.is(histogram.complexity, 1);
  t.deepEqual(
    [...histogram],
    [{ codePoint: A, hitCount: 1, missCount: 0, timeToType: 100 }],
  );
});

test("build histogram from many steps", (t) => {
  const histogram = Histogram.from([
    { codePoint: A, timeStamp: 200, typo: false },
    { codePoint: B, timeStamp: 300, typo: false },
    { codePoint: C, timeStamp: 400, typo: false },
    { codePoint: X, timeStamp: 401, typo: false }, // Invalid step.
  ]);

  t.is(histogram.complexity, 3);
  t.deepEqual(
    [...histogram],
    [
      { codePoint: A, hitCount: 1, missCount: 0, timeToType: 0 },
      { codePoint: B, hitCount: 1, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 1, missCount: 0, timeToType: 100 },
    ],
  );
});

test("build histogram from many steps with started at", (t) => {
  const histogram = Histogram.from(
    [
      { codePoint: A, timeStamp: 200, typo: false },
      { codePoint: B, timeStamp: 300, typo: false },
      { codePoint: C, timeStamp: 400, typo: false },
      { codePoint: X, timeStamp: 401, typo: false }, // Invalid step.
    ],
    { startedAt: 100 },
  );

  t.is(histogram.complexity, 3);
  t.deepEqual(
    [...histogram],
    [
      { codePoint: A, hitCount: 1, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 1, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 1, missCount: 0, timeToType: 100 },
    ],
  );
});

test("ignore typos", (t) => {
  const histogram = Histogram.from(
    [
      { codePoint: A, timeStamp: 100, typo: true },
      { codePoint: B, timeStamp: 200, typo: true },
      { codePoint: C, timeStamp: 300, typo: true },
      { codePoint: X, timeStamp: 301, typo: false }, // Invalid step.
    ],
    { startedAt: 0 },
  );

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

test("compute time to type", (t) => {
  const histogram = Histogram.from(
    [
      { codePoint: A, timeStamp: 100, typo: false },
      { codePoint: B, timeStamp: 200, typo: false },
      { codePoint: A, timeStamp: 300, typo: false },
      { codePoint: C, timeStamp: 500, typo: false },
      { codePoint: X, timeStamp: 501, typo: false }, // Invalid step.
    ],
    { startedAt: 0 },
  );

  t.is(histogram.complexity, 3);
  t.deepEqual(
    [...histogram],
    [
      { codePoint: A, hitCount: 2, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 1, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 1, missCount: 0, timeToType: 200 },
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
