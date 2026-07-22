import { test } from "node:test";
import { FakeRNGStream } from "@keybr/rand";
import { equal, isNull } from "rich-assert";
import {
  interleavedWords,
  randomWords,
  uniqueWords,
  wordSequence,
} from "./words.ts";

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

test("interleaved words", () => {
  const rng = FakeRNGStream(4); // 0, 0.25, 0.5, 0.75, ...

  const words = interleavedWords(
    wordSequence(["main1", "main2", "main3", "main4"], { wordIndex: 0 }),
    wordSequence(["extra1", "extra2"], { wordIndex: 0 }),
    0.5,
    rng,
  );

  equal(words(), "extra1"); // 0 < 0.5
  equal(words(), "extra2"); // 0.25 < 0.5
  equal(words(), "main1"); // 0.5 is not < 0.5
  equal(words(), "main2"); // 0.75 is not < 0.5
});

test("interleaved words falls back to the main generator when the extra generator is exhausted", () => {
  const rng = FakeRNGStream(2);

  const words = interleavedWords(
    wordSequence(["main1", "main2"], { wordIndex: 0 }),
    wordSequence([], { wordIndex: 0 }),
    1,
    rng,
  );

  equal(words(), "main1");
  equal(words(), "main2");
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
