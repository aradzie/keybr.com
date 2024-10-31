import { test } from "node:test";
import { Book } from "@keybr/content";
import { assert } from "chai";
import { BookParagraphsGenerator } from "./book.ts";

test("generate words", () => {
  const generator = new BookParagraphsGenerator(
    {
      paragraphIndex: 0,
    },
    {
      book: Book.EN_ALICE_WONDERLAND,
      content: [
        ["Chapter I", ["one two three"]],
        ["Chapter II", ["four five six"]],
      ],
    },
  );

  const mark0 = generator.mark();

  assert.strictEqual(generator.nextWord(), "one");
  assert.strictEqual(generator.nextWord(), "two");
  assert.strictEqual(generator.nextWord(), "three");

  const mark1 = generator.mark();

  assert.strictEqual(generator.nextWord(), "four");
  assert.strictEqual(generator.nextWord(), "five");
  assert.strictEqual(generator.nextWord(), "six");
  assert.strictEqual(generator.nextWord(), "one");
  assert.strictEqual(generator.nextWord(), "two");

  generator.reset(mark1);

  assert.strictEqual(generator.nextWord(), "four");
  assert.strictEqual(generator.nextWord(), "five");

  generator.reset(mark0);

  assert.strictEqual(generator.nextWord(), "one");
  assert.strictEqual(generator.nextWord(), "two");
});
