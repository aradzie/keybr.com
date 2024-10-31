import { test } from "node:test";
import { type WordList } from "@keybr/content";
import { FakeRNGStream } from "@keybr/rand";
import { assert } from "chai";
import { CommonWordsGenerator } from "./commonwords.ts";

test("generate words", () => {
  const wordList: WordList = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
  ];
  const random = FakeRNGStream(wordList.length);
  const generator = new CommonWordsGenerator(
    { wordListSize: 1000 },
    wordList,
    random,
  );

  const mark0 = generator.mark();

  assert.strictEqual(generator.nextWord(), "one");
  assert.strictEqual(generator.nextWord(), "two");
  assert.strictEqual(generator.nextWord(), "three");

  const mark1 = generator.mark();

  assert.strictEqual(generator.nextWord(), "four");
  assert.strictEqual(generator.nextWord(), "five");
  assert.strictEqual(generator.nextWord(), "six");

  generator.reset(mark1);

  assert.strictEqual(generator.nextWord(), "four");
  assert.strictEqual(generator.nextWord(), "five");
  assert.strictEqual(generator.nextWord(), "six");

  generator.reset(mark0);

  assert.strictEqual(generator.nextWord(), "one");
  assert.strictEqual(generator.nextWord(), "two");
  assert.strictEqual(generator.nextWord(), "three");
});
