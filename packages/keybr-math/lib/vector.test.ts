import { test } from "node:test";
import { assert } from "chai";
import { Vector } from "./vector.ts";

test("validate arguments", () => {
  assert.throws(() => new Vector([NaN]));
  assert.throws(() => new Vector().add(NaN));

  const vector = new Vector([0]);
  assert.throws(() => vector.at(NaN));
  assert.throws(() => vector.at(-1));
  assert.throws(() => vector.at(1));
  assert.throws(() => vector.at(1.1));
});

test("mutate vector", () => {
  const vector = new Vector();

  assert.strictEqual(vector.length, 0);
  assert.deepStrictEqual([...vector], []);

  vector.add(0);
  assert.strictEqual(vector.length, 1);
  assert.deepStrictEqual([...vector], [0]);

  vector.add(1);
  assert.strictEqual(vector.length, 2);
  assert.deepStrictEqual([...vector], [0, 1]);
});
