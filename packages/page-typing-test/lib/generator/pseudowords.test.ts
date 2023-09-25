import { FakePhoneticModel } from "@keybr/phonetic-model";
import { FakeRNGStream, LCG } from "@keybr/rand";
import test from "ava";
import { PseudoWordsGenerator } from "./pseudowords.ts";

test("generate words", (t) => {
  const words = [
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
  const random = FakeRNGStream(words.length);
  const model = new FakePhoneticModel(words, LCG(1));
  const generator = new PseudoWordsGenerator(model, random);

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
