import { test } from "node:test";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { FakeRNGStream, LCG } from "@keybr/rand";
import { equal } from "rich-assert";
import { PseudoWordsGenerator } from "./pseudowords.ts";

test("generate words", () => {
  const words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  const random = FakeRNGStream(words.length);
  const model = new FakePhoneticModel(words, LCG(1));
  const generator = new PseudoWordsGenerator(model, random);

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
