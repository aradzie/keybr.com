import { test } from "node:test";
import { FakeRNGStream } from "@keybr/rand";
import { equal } from "rich-assert";
import { CommonWordsGenerator } from "./commonwords.ts";

test("generate words", () => {
  const words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  const random = FakeRNGStream(words.length);
  const generator = new CommonWordsGenerator({ wordListSize: 1000 }, words, random);

  const mark0 = generator.mark();

  equal(generator.nextWord(), "one");
  equal(generator.nextWord(), "two");
  equal(generator.nextWord(), "three");

  const mark1 = generator.mark();

  equal(generator.nextWord(), "four");
  equal(generator.nextWord(), "five");
  equal(generator.nextWord(), "six");

  generator.reset(mark1);

  equal(generator.nextWord(), "four");
  equal(generator.nextWord(), "five");
  equal(generator.nextWord(), "six");

  generator.reset(mark0);

  equal(generator.nextWord(), "one");
  equal(generator.nextWord(), "two");
  equal(generator.nextWord(), "three");
});
