import test from "ava";
import { Histogram, KeySet, Range, resample, Vector } from "./data.ts";

test("histogram", (t) => {
  const keySet = new KeySet<string>(["a", "b", "c"]);
  const histogram = new Histogram(keySet);

  t.is(histogram.asVector().length, 3);
  t.deepEqual([...histogram.asVector()], [0, 0, 0]);

  histogram.set("a", 0);
  t.is(histogram.asVector().length, 3);
  t.deepEqual([...histogram.asVector()], [0, 0, 0]);

  histogram.set("b", 1);
  t.is(histogram.asVector().length, 3);
  t.deepEqual([...histogram.asVector()], [0, 1, 0]);
});

test("vector", (t) => {
  const vector = new Vector();

  t.is(vector.length, 0);
  t.deepEqual([...vector], []);
  t.deepEqual(vector.values, []);

  vector.add(0);
  t.is(vector.length, 1);
  t.deepEqual([...vector], [0]);
  t.deepEqual(vector.values, [0]);

  vector.add(1);
  t.is(vector.length, 2);
  t.deepEqual([...vector], [0, 1]);
  t.deepEqual(vector.values, [0, 1]);
});

test("round range", (t) => {
  const range = new Range();

  range.max = 3;
  range.min = 3;

  range.round(1);

  t.is(range.max, 3);
  t.is(range.min, 3);

  range.round(5);

  t.is(range.max, 5);
  t.is(range.min, 0);
});

test("resample", (t) => {
  t.deepEqual(resample([1, 2], 4), [1, 1, 2, 2]);
  t.deepEqual(resample([1, 1, 2, 2], 2), [1, 2]);
});
