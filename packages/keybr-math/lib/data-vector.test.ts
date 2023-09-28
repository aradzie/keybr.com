import test from "ava";
import { Vector } from "./data-vector.ts";

test("mutate vector", (t) => {
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
