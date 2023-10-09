import test from "ava";
import { Histogram } from "./histogram.ts";

const A = 0x61;
const B = 0x62;
const C = 0x63;
const X = 0x78;

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
    [{ codePoint: A, timeStamp: 200, typo: false }],
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
    ],
    {
      startedAt: 0,
    },
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
      { codePoint: X, timeStamp: 100, typo: false },
      { codePoint: A, timeStamp: 200, typo: false },
      { codePoint: X, timeStamp: 300, typo: false },
      { codePoint: A, timeStamp: 500, typo: false },
    ],
    {
      startedAt: 0,
    },
  );

  t.is(histogram.complexity, 2);
  t.deepEqual(
    [...histogram],
    [
      { codePoint: A, hitCount: 2, missCount: 0, timeToType: 150 },
      { codePoint: X, hitCount: 2, missCount: 0, timeToType: 100 },
    ],
  );
});
