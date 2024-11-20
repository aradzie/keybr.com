import { test } from "node:test";
import { deepEqual, equal } from "rich-assert";
import { Histogram } from "./histogram.ts";
import { KeySet } from "./keyset.ts";

test("mutate histograms with a shared key set", () => {
  const keySet = new KeySet<string>(["a", "b"]);
  const a = new Histogram(keySet);
  const b = new Histogram(keySet);

  equal(a.get("a"), 0);
  equal(a.get("b"), 0);
  equal(a.get("c"), 0);
  equal(b.get("a"), 0);
  equal(b.get("b"), 0);
  equal(b.get("c"), 0);

  deepEqual([...keySet], ["a", "b"]);
  deepEqual([...a.keys()], ["a", "b"]);
  deepEqual([...a.values()], [0, 0]);
  deepEqual([...b.keys()], ["a", "b"]);
  deepEqual([...b.values()], [0, 0]);

  a.set("a", 1);

  deepEqual([...keySet], ["a", "b"]);
  deepEqual([...a.keys()], ["a", "b"]);
  deepEqual([...a.values()], [1, 0]);
  deepEqual([...b.keys()], ["a", "b"]);
  deepEqual([...b.values()], [0, 0]);

  b.add("c", 1);
  b.add("c", 1);

  deepEqual([...keySet], ["a", "b", "c"]);
  deepEqual([...a.keys()], ["a", "b", "c"]);
  deepEqual([...a.values()], [1, 0, 0]);
  deepEqual([...b.keys()], ["a", "b", "c"]);
  deepEqual([...b.values()], [0, 0, 2]);

  keySet.add("d");

  deepEqual([...keySet], ["a", "b", "c", "d"]);
  deepEqual([...a.keys()], ["a", "b", "c", "d"]);
  deepEqual([...a.values()], [1, 0, 0, 0]);
  deepEqual([...b.keys()], ["a", "b", "c", "d"]);
  deepEqual([...b.values()], [0, 0, 2, 0]);
});
