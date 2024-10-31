import { test } from "node:test";
import { assert } from "chai";
import { initials } from "./util.ts";

test("compute initials", () => {
  assert.strictEqual(initials(""), "");
  assert.strictEqual(initials("a"), "A");
  assert.strictEqual(initials(" a "), "A");
  assert.strictEqual(initials("abc"), "A");
  assert.strictEqual(initials(" abc "), "A");
  assert.strictEqual(initials("  a  b  "), "AB");
  assert.strictEqual(initials("  a  b  c  d  "), "ABC");
});

test("compute initials with custom limit", () => {
  assert.strictEqual(initials(" a b c d ", 0), "");
  assert.strictEqual(initials(" a b c d ", 1), "A");
  assert.strictEqual(initials(" a b c d ", 2), "AB");
  assert.strictEqual(initials(" a b c d ", 3), "ABC");
  assert.strictEqual(initials(" a b c d ", 4), "ABCD");
  assert.strictEqual(initials(" a b c d ", 5), "ABCD");
});
