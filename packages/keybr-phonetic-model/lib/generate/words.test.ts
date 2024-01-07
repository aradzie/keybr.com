import { toCodePoints } from "@keybr/unicode";
import test from "ava";
import { findWords, fromCsv, toCsv, type Word } from "./words.ts";

test("find words", (t) => {
  const alphabet = [...toCodePoints("abcdefghijklmnopqrstuvwxyz")];
  const text = "abc One, Two! 'Three' one/two/three ONE-TWO-THREE xyz";
  t.deepEqual(findWords(text, []), []);
  t.deepEqual(findWords(text, alphabet), [
    ["one", 3],
    ["three", 3],
    ["two", 3],
  ]);
});

test("csv", (t) => {
  const words: Word[] = [
    ["one", 3],
    ["two", 5],
  ];

  t.deepEqual(fromCsv(toCsv(words)), words);
});
