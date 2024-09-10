import { test } from "node:test";
import { assert } from "chai";
import { parseSpeed, parseUserIdRange } from "./argument.ts";

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

test("parse speed", () => {
  assert.strictEqual(parseSpeed("100"), 500);
  assert.strictEqual(parseSpeed("100wpm"), 500);
  assert.strictEqual(parseSpeed("100cpm"), 100);

  assert.throws(() => {
    parseSpeed("-100");
    parseSpeed("+100");
    parseSpeed("100.0");
    parseSpeed("100xyz");
    parseSpeed("100.0xyz");
  });
});
