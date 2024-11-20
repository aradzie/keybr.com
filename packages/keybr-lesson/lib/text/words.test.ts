import { test } from "node:test";
import { FakeRNGStream } from "@keybr/rand";
import { equal, isNull } from "rich-assert";
import { randomWords, uniqueWords, wordSequence } from "./words.ts";

test("random words", () => {
  const rng = FakeRNGStream(3);

  isNull(randomWords([], rng)());

  const wordList = ["a", "b", "c"];

  equal(randomWords(wordList, rng)(), "a");
  equal(randomWords(wordList, rng)(), "b");
  equal(randomWords(wordList, rng)(), "c");
});

test("word sequence", () => {
  isNull(wordSequence([], { wordIndex: 0 })());

  const wordList = ["a", "b", "c"];
  const cursor = { wordIndex: 100 };

  equal(wordSequence(wordList, cursor)(), "a");
  equal(cursor.wordIndex, 1);
  equal(wordSequence(wordList, cursor)(), "b");
  equal(cursor.wordIndex, 2);
  equal(wordSequence(wordList, cursor)(), "c");
  equal(cursor.wordIndex, 3);
  equal(wordSequence(wordList, cursor)(), "a");
  equal(cursor.wordIndex, 1);
});

test("unique words", () => {
  isNull(uniqueWords(wordSequence([], { wordIndex: 0 }))());
  isNull(uniqueWords(randomWords([], () => 0))());

  const words = uniqueWords(
    wordSequence(["a", "a", "b", "b", "c"], { wordIndex: 0 }),
  );

  equal(words(), "a");
  equal(words(), "b");
  equal(words(), "c");
  equal(words(), "a");
  equal(words(), "b");
});
