import test from "ava";
import { KeySet } from "./keyset.ts";

test("construct", (t) => {
  const keySet = new KeySet([1, 1, 1, 2]);

  t.deepEqual([...keySet], [1, 2]);

  keySet.add(3);

  t.deepEqual([...keySet], [1, 2, 3]);
});
