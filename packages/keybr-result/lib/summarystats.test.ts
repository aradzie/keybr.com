import { Letter } from "@keybr/phonetic-model";
import { Histogram } from "@keybr/textinput";
import test from "ava";
import { ResultFaker } from "./fake.tsx";
import { newSummaryStats } from "./summarystats.ts";

test("compute summary stats", (t) => {
  const letter = new Letter(97, 1);
  const faker = new ResultFaker();
  const r1 = faker.nextResult({
    length: 50,
    time: 5000,
    errors: 0,
    histogram: new Histogram([
      {
        codePoint: letter.codePoint,
        hitCount: 1,
        missCount: 0,
        timeToType: 500,
      },
    ]),
  });
  const r2 = faker.nextResult({
    length: 50,
    time: 10000,
    errors: 2,
    histogram: new Histogram([
      {
        codePoint: letter.codePoint,
        hitCount: 1,
        missCount: 0,
        timeToType: 500,
      },
    ]),
  });

  t.deepEqual(newSummaryStats([]), {
    totalTime: 0,
    speed: { last: 0, delta: 0, max: 0, min: 0, avg: 0 },
    accuracy: { last: 0, delta: 0, max: 0, min: 0, avg: 0 },
    score: { last: 0, delta: 0, max: 0, min: 0, avg: 0 },
  });

  t.deepEqual(newSummaryStats([r1]), {
    totalTime: 5000,
    speed: { last: 600, delta: 600, max: 600, min: 600, avg: 600 },
    accuracy: { last: 1.0, delta: 1.0, max: 1.0, min: 1.0, avg: 1.0 },
    score: { last: 600, delta: 600, max: 600, min: 600, avg: 600 },
  });

  t.deepEqual(newSummaryStats([r1, r2]), {
    totalTime: 15000,
    speed: { last: 300, delta: -300, max: 600, min: 300, avg: 450 },
    accuracy: {
      last: 0.96,
      delta: -0.040000000000000036,
      max: 1.0,
      min: 0.96,
      avg: 0.98,
    },
    score: { last: 100, delta: -500, max: 600, min: 100, avg: 350 },
  });
});
