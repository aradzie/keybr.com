import { test } from "node:test";
import { assert } from "chai";
import { KeySet } from "./keyset.ts";

test("construct", () => {
  const keySet = new KeySet([1, 1, 1, 2]);

  assert.deepStrictEqual([...keySet], [1, 2]);

  keySet.add(3);

  assert.deepStrictEqual([...keySet], [1, 2, 3]);
});
