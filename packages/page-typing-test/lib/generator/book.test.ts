import { Book } from "@keybr/content";
import test from "ava";
import { BookParagraphsGenerator } from "./book.ts";

test("generate words", (t) => {
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

  t.is(generator.nextWord(), "one");
  t.is(generator.nextWord(), "two");
  t.is(generator.nextWord(), "three");

  const mark1 = generator.mark();

  t.is(generator.nextWord(), "four");
  t.is(generator.nextWord(), "five");
  t.is(generator.nextWord(), "six");
  t.is(generator.nextWord(), "one");
  t.is(generator.nextWord(), "two");

  generator.reset(mark1);

  t.is(generator.nextWord(), "four");
  t.is(generator.nextWord(), "five");

  generator.reset(mark0);

  t.is(generator.nextWord(), "one");
  t.is(generator.nextWord(), "two");
});
