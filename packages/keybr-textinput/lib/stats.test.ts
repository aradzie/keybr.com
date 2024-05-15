import test from "ava";
import { Histogram } from "./histogram.ts";
import { makeStats } from "./stats.ts";

const A = 0x0061;
const B = 0x0062;
const C = 0x0063;
const X = 0x0078;
const Space = 0x0020;

test("compute stats", (t) => {
  const stats = makeStats([
    { codePoint: X, timeStamp: 100, typo: false }, // Trigger is ignored.
    { codePoint: A, timeStamp: 200, typo: false },
    { codePoint: B, timeStamp: 300, typo: false },
    { codePoint: C, timeStamp: 400, typo: false },
    { codePoint: Space, timeStamp: 500, typo: true },
  ]);

  t.deepEqual(stats, {
    time: 400,
    speed: 600,
    length: 4,
    errors: 1,
    accuracy: 0.75,
    alternations: 1,
    histogram: new Histogram([
      { codePoint: Space, hitCount: 1, missCount: 1, timeToType: 0 },
      { codePoint: A, hitCount: 1, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 1, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 1, missCount: 0, timeToType: 100 },
    ]),
  });
});

test("compute with started at", (t) => {
  const stats = makeStats(
    [
      { codePoint: A, timeStamp: 200, typo: false },
      { codePoint: B, timeStamp: 300, typo: false },
      { codePoint: C, timeStamp: 400, typo: false },
      { codePoint: Space, timeStamp: 500, typo: true },
    ],
    {
      startedAt: 100,
    },
  );

  t.deepEqual(stats, {
    time: 400,
    speed: 600,
    length: 4,
    errors: 1,
    accuracy: 0.75,
    alternations: 1,
    histogram: new Histogram([
      { codePoint: Space, hitCount: 1, missCount: 1, timeToType: 0 },
      { codePoint: A, hitCount: 1, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 1, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 1, missCount: 0, timeToType: 100 },
    ]),
  });
});

test("compute with ended at", (t) => {
  const stats = makeStats(
    [
      { codePoint: X, timeStamp: 100, typo: false }, // Trigger is ignored.
      { codePoint: A, timeStamp: 200, typo: false },
      { codePoint: B, timeStamp: 300, typo: false },
      { codePoint: C, timeStamp: 400, typo: false },
      { codePoint: Space, timeStamp: 500, typo: true },
    ],
    {
      endedAt: 600,
    },
  );

  t.deepEqual(stats, {
    time: 500,
    speed: 480,
    length: 4,
    errors: 1,
    accuracy: 0.75,
    alternations: 1,
    histogram: new Histogram([
      { codePoint: Space, hitCount: 1, missCount: 1, timeToType: 0 },
      { codePoint: A, hitCount: 1, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 1, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 1, missCount: 0, timeToType: 100 },
    ]),
  });
});

test("compute with started at and ended at", (t) => {
  const stats = makeStats(
    [
      { codePoint: A, timeStamp: 200, typo: false },
      { codePoint: B, timeStamp: 300, typo: false },
      { codePoint: C, timeStamp: 400, typo: false },
      { codePoint: Space, timeStamp: 500, typo: true },
    ],
    {
      startedAt: 100,
      endedAt: 600,
    },
  );

  t.deepEqual(stats, {
    time: 500,
    speed: 480,
    length: 4,
    errors: 1,
    accuracy: 0.75,
    alternations: 1,
    histogram: new Histogram([
      { codePoint: Space, hitCount: 1, missCount: 1, timeToType: 0 },
      { codePoint: A, hitCount: 1, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 1, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 1, missCount: 0, timeToType: 100 },
    ]),
  });
});

test("compute accuracy", (t) => {
  t.is(
    makeStats([
      { codePoint: X, timeStamp: 100, typo: false }, // Trigger is ignored.
      { codePoint: A, timeStamp: 200, typo: true },
      { codePoint: B, timeStamp: 300, typo: true },
      { codePoint: C, timeStamp: 400, typo: true },
      { codePoint: Space, timeStamp: 500, typo: true },
    ]).accuracy,
    0,
  );

  t.is(
    makeStats([
      { codePoint: X, timeStamp: 100, typo: false }, // Trigger is ignored.
      { codePoint: A, timeStamp: 200, typo: false },
      { codePoint: B, timeStamp: 300, typo: false },
      { codePoint: C, timeStamp: 400, typo: true },
      { codePoint: Space, timeStamp: 500, typo: true },
    ]).accuracy,
    0.5,
  );

  t.is(
    makeStats([
      { codePoint: X, timeStamp: 100, typo: false }, // Trigger is ignored.
      { codePoint: A, timeStamp: 200, typo: false },
      { codePoint: B, timeStamp: 300, typo: false },
      { codePoint: C, timeStamp: 400, typo: false },
      { codePoint: Space, timeStamp: 500, typo: false },
    ]).accuracy,
    1,
  );
});

test("compute alternations", (t) => {
  t.is(makeStats([]).alternations, 0);

  t.is(
    makeStats([
      { codePoint: X, timeStamp: 100, typo: false }, // Trigger is ignored.
      { codePoint: X, timeStamp: 200, typo: false },
      { codePoint: X, timeStamp: 300, typo: false },
      { codePoint: X, timeStamp: 400, typo: false },
      { codePoint: Space, timeStamp: 500, typo: false },
    ]).alternations,
    0.3333333333333333,
  );

  t.is(
    makeStats([
      { codePoint: X, timeStamp: 100, typo: false }, // Trigger is ignored.
      { codePoint: A, timeStamp: 200, typo: false },
      { codePoint: B, timeStamp: 300, typo: false },
      { codePoint: C, timeStamp: 400, typo: false },
      { codePoint: Space, timeStamp: 500, typo: false },
    ]).alternations,
    1,
  );

  t.is(
    makeStats([
      { codePoint: X, timeStamp: 100, typo: true }, // Trigger is ignored.
      { codePoint: A, timeStamp: 200, typo: true },
      { codePoint: B, timeStamp: 300, typo: true },
      { codePoint: C, timeStamp: 400, typo: true },
      { codePoint: Space, timeStamp: 500, typo: true },
    ]).alternations,
    1,
  );
});
