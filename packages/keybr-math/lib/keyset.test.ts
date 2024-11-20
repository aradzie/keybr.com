import { test } from "node:test";
import { deepEqual } from "rich-assert";
import { KeySet } from "./keyset.ts";

test("construct", () => {
  const keySet = new KeySet([1, 1, 1, 2]);

  deepEqual([...keySet], [1, 2]);

  keySet.add(3);

  deepEqual([...keySet], [1, 2, 3]);
});
