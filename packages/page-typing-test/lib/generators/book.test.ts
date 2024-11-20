import { test } from "node:test";
import { Book } from "@keybr/content";
import { equal } from "rich-assert";
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

  equal(generator.nextWord(), "one");
  equal(generator.nextWord(), "two");
  equal(generator.nextWord(), "three");

  const mark1 = generator.mark();

  equal(generator.nextWord(), "four");
  equal(generator.nextWord(), "five");
  equal(generator.nextWord(), "six");
  equal(generator.nextWord(), "one");
  equal(generator.nextWord(), "two");

  generator.reset(mark1);

  equal(generator.nextWord(), "four");
  equal(generator.nextWord(), "five");

  generator.reset(mark0);

  equal(generator.nextWord(), "one");
  equal(generator.nextWord(), "two");
});
