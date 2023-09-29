import test from "ava";
import { Histogram } from "./histogram.ts";
import { KeySet } from "./keyset.ts";

test("mutate histograms with a shared key set", (t) => {
  const keySet = new KeySet<string>(["a", "b"]);
  const a = new Histogram(keySet);
  const b = new Histogram(keySet);

  t.is(a.get("a"), 0);
  t.is(a.get("b"), 0);
  t.is(a.get("c"), 0);
  t.is(b.get("a"), 0);
  t.is(b.get("b"), 0);
  t.is(b.get("c"), 0);

  t.deepEqual([...keySet], ["a", "b"]);
  t.deepEqual([...a.keys()], ["a", "b"]);
  t.deepEqual([...a.values()], [0, 0]);
  t.deepEqual([...b.keys()], ["a", "b"]);
  t.deepEqual([...b.values()], [0, 0]);

  a.set("a", 1);

  t.deepEqual([...keySet], ["a", "b"]);
  t.deepEqual([...a.keys()], ["a", "b"]);
  t.deepEqual([...a.values()], [1, 0]);
  t.deepEqual([...b.keys()], ["a", "b"]);
  t.deepEqual([...b.values()], [0, 0]);

  b.add("c", 1);
  b.add("c", 1);

  t.deepEqual([...keySet], ["a", "b", "c"]);
  t.deepEqual([...a.keys()], ["a", "b", "c"]);
  t.deepEqual([...a.values()], [1, 0, 0]);
  t.deepEqual([...b.keys()], ["a", "b", "c"]);
  t.deepEqual([...b.values()], [0, 0, 2]);

  keySet.add("d");

  t.deepEqual([...keySet], ["a", "b", "c", "d"]);
  t.deepEqual([...a.keys()], ["a", "b", "c", "d"]);
  t.deepEqual([...a.values()], [1, 0, 0, 0]);
  t.deepEqual([...b.keys()], ["a", "b", "c", "d"]);
  t.deepEqual([...b.values()], [0, 0, 2, 0]);
});
