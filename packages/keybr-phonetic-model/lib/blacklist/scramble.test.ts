import { test } from "node:test";
import { assert } from "chai";
import { scrambleWord, unscrambleWord } from "./scramble.ts";

test("scramble word", () => {
  assert.strictEqual(scrambleWord("a"), "a");
  assert.strictEqual(scrambleWord("ab"), "ba");
  assert.strictEqual(scrambleWord("abc"), "bac");
  assert.strictEqual(scrambleWord("abcdef"), "bafedc");
});

test("unscramble word", () => {
  assert.strictEqual(unscrambleWord("a"), "a");
  assert.strictEqual(unscrambleWord("ba"), "ab");
  assert.strictEqual(unscrambleWord("bac"), "abc");
  assert.strictEqual(unscrambleWord("bafedc"), "abcdef");
});
