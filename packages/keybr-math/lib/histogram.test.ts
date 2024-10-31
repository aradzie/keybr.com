import { test } from "node:test";
import { assert } from "chai";
import { Histogram } from "./histogram.ts";
import { KeySet } from "./keyset.ts";

test("mutate histograms with a shared key set", () => {
  const keySet = new KeySet<string>(["a", "b"]);
  const a = new Histogram(keySet);
  const b = new Histogram(keySet);

  assert.strictEqual(a.get("a"), 0);
  assert.strictEqual(a.get("b"), 0);
  assert.strictEqual(a.get("c"), 0);
  assert.strictEqual(b.get("a"), 0);
  assert.strictEqual(b.get("b"), 0);
  assert.strictEqual(b.get("c"), 0);

  assert.deepStrictEqual([...keySet], ["a", "b"]);
  assert.deepStrictEqual([...a.keys()], ["a", "b"]);
  assert.deepStrictEqual([...a.values()], [0, 0]);
  assert.deepStrictEqual([...b.keys()], ["a", "b"]);
  assert.deepStrictEqual([...b.values()], [0, 0]);

  a.set("a", 1);

  assert.deepStrictEqual([...keySet], ["a", "b"]);
  assert.deepStrictEqual([...a.keys()], ["a", "b"]);
  assert.deepStrictEqual([...a.values()], [1, 0]);
  assert.deepStrictEqual([...b.keys()], ["a", "b"]);
  assert.deepStrictEqual([...b.values()], [0, 0]);

  b.add("c", 1);
  b.add("c", 1);

  assert.deepStrictEqual([...keySet], ["a", "b", "c"]);
  assert.deepStrictEqual([...a.keys()], ["a", "b", "c"]);
  assert.deepStrictEqual([...a.values()], [1, 0, 0]);
  assert.deepStrictEqual([...b.keys()], ["a", "b", "c"]);
  assert.deepStrictEqual([...b.values()], [0, 0, 2]);

  keySet.add("d");

  assert.deepStrictEqual([...keySet], ["a", "b", "c", "d"]);
  assert.deepStrictEqual([...a.keys()], ["a", "b", "c", "d"]);
  assert.deepStrictEqual([...a.values()], [1, 0, 0, 0]);
  assert.deepStrictEqual([...b.keys()], ["a", "b", "c", "d"]);
  assert.deepStrictEqual([...b.values()], [0, 0, 2, 0]);
});
