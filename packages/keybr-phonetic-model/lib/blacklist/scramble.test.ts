import test from "ava";
import { scrambleWord, unscrambleWord } from "./scramble.ts";

test("scramble word", (t) => {
  t.is(scrambleWord("a"), "a");
  t.is(scrambleWord("ab"), "ba");
  t.is(scrambleWord("abc"), "bac");
  t.is(scrambleWord("abcdef"), "bafedc");
});

test("unscramble word", (t) => {
  t.is(unscrambleWord("a"), "a");
  t.is(unscrambleWord("ba"), "ab");
  t.is(unscrambleWord("bac"), "abc");
  t.is(unscrambleWord("bafedc"), "abcdef");
});
