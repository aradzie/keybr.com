import { test } from "node:test";
import { deepEqual, equal } from "rich-assert";
import { Histogram } from "./histogram.ts";
import { makeStats } from "./stats.ts";

const A = /* "a" */ 0x0061;
const B = /* "b" */ 0x0062;
const C = /* "c" */ 0x0063;
const X = /* "x" */ 0x0078;
const Space = /* SPACE */ 0x0020;

test("compute stats", () => {
  const stats = makeStats([
    { timeStamp: 100.1, codePoint: X, timeToType: 900.1, typo: false }, // Trigger is ignored.
    { timeStamp: 200.1, codePoint: A, timeToType: 100.1, typo: false },
    { timeStamp: 300.1, codePoint: B, timeToType: 100.1, typo: false },
    { timeStamp: 400.1, codePoint: C, timeToType: 100.1, typo: false },
    { timeStamp: 500.2, codePoint: Space, timeToType: 100.1, typo: true },
  ]);

  deepEqual(stats, {
    time: 400,
    speed: 750,
    length: 5,
    errors: 1,
    accuracy: 0.8,
    histogram: new Histogram([
      { codePoint: Space, hitCount: 1, missCount: 1, timeToType: 0 },
      { codePoint: A, hitCount: 1, missCount: 0, timeToType: 100 },
      { codePoint: B, hitCount: 1, missCount: 0, timeToType: 100 },
      { codePoint: C, hitCount: 1, missCount: 0, timeToType: 100 },
    ]),
  });
});

test("compute accuracy", () => {
  equal(makeStats([]).accuracy, 0);

  equal(
    makeStats([
      { timeStamp: 100, codePoint: X, timeToType: 900, typo: true }, // Trigger is ignored.
      { timeStamp: 200, codePoint: A, timeToType: 100, typo: true },
      { timeStamp: 300, codePoint: B, timeToType: 100, typo: true },
      { timeStamp: 400, codePoint: C, timeToType: 100, typo: true },
    ]).accuracy,
    0,
  );

  equal(
    makeStats([
      { timeStamp: 100, codePoint: X, timeToType: 900, typo: false }, // Trigger is ignored.
      { timeStamp: 200, codePoint: A, timeToType: 100, typo: false },
      { timeStamp: 300, codePoint: B, timeToType: 100, typo: true },
      { timeStamp: 400, codePoint: C, timeToType: 100, typo: true },
    ]).accuracy,
    0.5,
  );

  equal(
    makeStats([
      { timeStamp: 100, codePoint: X, timeToType: 900, typo: false }, // Trigger is ignored.
      { timeStamp: 200, codePoint: A, timeToType: 100, typo: false },
      { timeStamp: 300, codePoint: B, timeToType: 100, typo: false },
      { timeStamp: 400, codePoint: C, timeToType: 100, typo: false },
    ]).accuracy,
    1,
  );
});
