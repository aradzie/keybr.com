import { test } from "node:test";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { FakeRNGStream, LCG } from "@keybr/rand";
import { assert } from "chai";
import { PseudoWordsGenerator } from "./pseudowords.ts";

test("generate words", () => {
  const words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  const random = FakeRNGStream(words.length);
  const model = new FakePhoneticModel(words, LCG(1));
  const generator = new PseudoWordsGenerator(model, random);

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
