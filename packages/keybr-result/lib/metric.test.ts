import test from "ava";
import { Counter } from "./metric.ts";

test("counter", (t) => {
  const counter = new Counter();

  t.deepEqual(counter.toMetric(), {
    last: 0,
    delta: 0,
    max: 0,
    min: 0,
    avg: 0,
  });

  counter.append(10);

  t.deepEqual(counter.toMetric(), {
    last: 10,
    delta: 10,
    max: 10,
    min: 10,
    avg: 10,
  });

  counter.append(20);

  t.deepEqual(counter.toMetric(), {
    last: 20,
    delta: 10,
    max: 20,
    min: 10,
    avg: 15,
  });

  counter.append(15);

  t.deepEqual(counter.toMetric(), {
    last: 15,
    delta: 0,
    max: 20,
    min: 10,
    avg: 15,
  });
});
