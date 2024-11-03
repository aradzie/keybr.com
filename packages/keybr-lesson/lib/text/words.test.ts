import { test } from "node:test";
import { FakeRNGStream } from "@keybr/rand";
import { assert } from "chai";
import { randomWords, uniqueWords, wordSequence } from "./words.ts";

test("random words", () => {
  const rng = FakeRNGStream(3);

  assert.isNull(randomWords([], rng)());

  const wordList = ["a", "b", "c"];

  assert.strictEqual(randomWords(wordList, rng)(), "a");
  assert.strictEqual(randomWords(wordList, rng)(), "b");
  assert.strictEqual(randomWords(wordList, rng)(), "c");
});

test("word sequence", () => {
  assert.isNull(wordSequence([], { wordIndex: 0 })());

  const wordList = ["a", "b", "c"];
  const cursor = { wordIndex: 100 };

  assert.strictEqual(wordSequence(wordList, cursor)(), "a");
  assert.strictEqual(cursor.wordIndex, 1);
  assert.strictEqual(wordSequence(wordList, cursor)(), "b");
  assert.strictEqual(cursor.wordIndex, 2);
  assert.strictEqual(wordSequence(wordList, cursor)(), "c");
  assert.strictEqual(cursor.wordIndex, 3);
  assert.strictEqual(wordSequence(wordList, cursor)(), "a");
  assert.strictEqual(cursor.wordIndex, 1);
});

test("unique words", () => {
  assert.isNull(uniqueWords(wordSequence([], { wordIndex: 0 }))());
  assert.isNull(uniqueWords(randomWords([], () => 0))());

  const words = uniqueWords(
    wordSequence(["a", "a", "b", "b", "c"], { wordIndex: 0 }),
  );

  assert.strictEqual(words(), "a");
  assert.strictEqual(words(), "b");
  assert.strictEqual(words(), "c");
  assert.strictEqual(words(), "a");
  assert.strictEqual(words(), "b");
});
