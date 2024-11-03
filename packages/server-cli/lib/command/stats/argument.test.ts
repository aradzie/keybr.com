import { test } from "node:test";
import { assert } from "chai";
import { parseUserIdRange } from "./argument.ts";

test("parse user id range", () => {
  assert.deepStrictEqual([...parseUserIdRange("1")], [1]);
  assert.deepStrictEqual([...parseUserIdRange("1-3")], [1, 2, 3]);
  assert.deepStrictEqual([...parseUserIdRange("1,2,3")], [1, 2, 3]);
  assert.deepStrictEqual([...parseUserIdRange("1-2,2-3")], [1, 2, 3]);
  assert.throws(() => {
    parseUserIdRange("-1");
  });
  assert.throws(() => {
    parseUserIdRange("a");
  });
  assert.throws(() => {
    parseUserIdRange(String(0xffffffff + 1));
  });
  assert.throws(() => {
    parseUserIdRange("2-1");
  });
});
