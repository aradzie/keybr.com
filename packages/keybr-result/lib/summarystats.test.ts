import { Letter } from "@keybr/phonetic-model";
import { Histogram } from "@keybr/textinput";
import test from "ava";
import { ResultFaker } from "./fake.tsx";
import { MutableMetric, MutableSummaryStats } from "./summarystats.ts";

test("metric", (t) => {
  const metric = new MutableMetric();

  t.deepEqual(metric.copy(), {
    last: 0,
    delta: 0,
    max: 0,
    min: 0,
    avg: 0,
  });

  metric.append(10);

  t.deepEqual(metric.copy(), {
    last: 10,
    delta: 10,
    max: 10,
    min: 10,
    avg: 10,
  });

  metric.append(20);

  t.deepEqual(metric.copy(), {
    last: 20,
    delta: 10,
    max: 20,
    min: 10,
    avg: 15,
  });

  metric.append(15);

  t.deepEqual(metric.copy(), {
    last: 15,
    delta: 0,
    max: 20,
    min: 10,
    avg: 15,
  });
});

test("summary stats", (t) => {
  const letter = new Letter(0x0061, 1, "A");
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

  const stats = new MutableSummaryStats();

  t.deepEqual(stats.copy(), {
    count: 0,
    time: 0,
    speed: { last: 0, delta: 0, max: 0, min: 0, avg: 0 },
    accuracy: { last: 0, delta: 0, max: 0, min: 0, avg: 0 },
    score: { last: 0, delta: 0, max: 0, min: 0, avg: 0 },
  });

  stats.append(r1);

  t.deepEqual(stats.copy(), {
    count: 1,
    time: 5000,
    speed: { last: 600, delta: 600, max: 600, min: 600, avg: 600 },
    accuracy: { last: 1.0, delta: 1.0, max: 1.0, min: 1.0, avg: 1.0 },
    score: { last: 600, delta: 600, max: 600, min: 600, avg: 600 },
  });

  stats.append(r2);

  t.deepEqual(stats.copy(), {
    count: 2,
    time: 15000,
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
