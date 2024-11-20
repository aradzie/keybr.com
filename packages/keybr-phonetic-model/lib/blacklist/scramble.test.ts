import { test } from "node:test";
import { equal } from "rich-assert";
import { scrambleWord, unscrambleWord } from "./scramble.ts";

test("scramble word", () => {
  equal(scrambleWord("a"), "a");
  equal(scrambleWord("ab"), "ba");
  equal(scrambleWord("abc"), "bac");
  equal(scrambleWord("abcdef"), "bafedc");
});

test("unscramble word", () => {
  equal(unscrambleWord("a"), "a");
  equal(unscrambleWord("ba"), "ab");
  equal(unscrambleWord("bac"), "abc");
  equal(unscrambleWord("bafedc"), "abcdef");
});
