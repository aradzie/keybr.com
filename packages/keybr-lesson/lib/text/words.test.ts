import test from "ava";
import { wordSequence } from "./words.ts";

test("word sequence", (t) => {
  const wordList = ["a", "b", "c"];
  const cursor = { wordIndex: 100 };

  t.is(wordSequence(wordList, cursor)(), "a");
  t.is(cursor.wordIndex, 1);
  t.is(wordSequence(wordList, cursor)(), "b");
  t.is(cursor.wordIndex, 2);
  t.is(wordSequence(wordList, cursor)(), "c");
  t.is(cursor.wordIndex, 3);
  t.is(wordSequence(wordList, cursor)(), "a");
  t.is(cursor.wordIndex, 1);
});
