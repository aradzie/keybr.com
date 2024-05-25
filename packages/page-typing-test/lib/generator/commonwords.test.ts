import { type WordList } from "@keybr/content";
import { FakeRNGStream } from "@keybr/rand";
import test from "ava";
import { CommonWordsGenerator } from "./commonwords.ts";

test("generate words", (t) => {
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

  t.is(generator.nextWord(), "one");
  t.is(generator.nextWord(), "two");
  t.is(generator.nextWord(), "three");

  const mark1 = generator.mark();

  t.is(generator.nextWord(), "four");
  t.is(generator.nextWord(), "five");
  t.is(generator.nextWord(), "six");

  generator.reset(mark1);

  t.is(generator.nextWord(), "four");
  t.is(generator.nextWord(), "five");
  t.is(generator.nextWord(), "six");

  generator.reset(mark0);

  t.is(generator.nextWord(), "one");
  t.is(generator.nextWord(), "two");
  t.is(generator.nextWord(), "three");
});
