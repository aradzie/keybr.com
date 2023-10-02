import { FakeRNGStream } from "@keybr/rand";
import test from "ava";
import { randomWords, uniqueWords, wordSequence } from "./words.ts";

test("random words", (t) => {
  const rng = FakeRNGStream(3);

  t.is(randomWords([], rng)(), null);

  const wordList = ["a", "b", "c"];

  t.is(randomWords(wordList, rng)(), "a");
  t.is(randomWords(wordList, rng)(), "b");
  t.is(randomWords(wordList, rng)(), "c");
});

test("word sequence", (t) => {
  t.is(wordSequence([], { wordIndex: 0 })(), null);

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

test("unique words", (t) => {
  t.is(uniqueWords(wordSequence([], { wordIndex: 0 }))(), null);
  t.is(uniqueWords(randomWords([], () => 0))(), null);

  const words = uniqueWords(
    wordSequence(["a", "a", "b", "b", "c"], { wordIndex: 0 }),
  );

  t.is(words(), "a");
  t.is(words(), "b");
  t.is(words(), "c");
  t.is(words(), "a");
  t.is(words(), "b");
});
