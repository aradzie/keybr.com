import { test } from "node:test";
import { assert } from "chai";
import { hashCode } from "./hash.ts";

test("hash code of string", () => {
  assert.strictEqual(hashCode(""), 0x00000001);
  assert.strictEqual(hashCode("hello"), 0x079df171);
  assert.strictEqual(hashCode("what a terrible failure"), 0x06092247);
});
