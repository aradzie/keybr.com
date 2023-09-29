import test from "ava";
import { Vector } from "./vector.ts";

test("validate arguments", (t) => {
  t.throws(() => new Vector([NaN]));
  t.throws(() => new Vector().add(NaN));

  const vector = new Vector([0]);
  t.throws(() => vector.at(NaN));
  t.throws(() => vector.at(-1));
  t.throws(() => vector.at(1));
  t.throws(() => vector.at(1.1));
});

test("mutate vector", (t) => {
  const vector = new Vector();

  t.is(vector.length, 0);
  t.deepEqual([...vector], []);

  vector.add(0);
  t.is(vector.length, 1);
  t.deepEqual([...vector], [0]);

  vector.add(1);
  t.is(vector.length, 2);
  t.deepEqual([...vector], [0, 1]);
});
