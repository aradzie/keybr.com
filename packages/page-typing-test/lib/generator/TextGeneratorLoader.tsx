import { BookContentLoader } from "@keybr/content-books";
import { WordListLoader } from "@keybr/content-words";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { LCG, type RNGStream } from "@keybr/rand";
import { type ReactNode } from "react";
import { BookParagraphsGenerator } from "./book.ts";
import { CommonWordsGenerator } from "./commonwords.ts";
import { PseudoWordsGenerator } from "./pseudowords.ts";
import { type TextGenerator, type TextSource } from "./types.ts";

export function TextGeneratorLoader({
  textSource,
  children,
}: {
  readonly textSource: TextSource;
  readonly children: (textGenerator: TextGenerator) => ReactNode;
}): ReactNode {
  switch (textSource.type) {
    case "common-words":
      return (
        <WordListLoader language={textSource.language}>
          {(wordList) => children(new CommonWordsGenerator(wordList, rng()))}
        </WordListLoader>
      );
    case "pseudo-words":
      return (
        <PhoneticModelLoader language={textSource.language}>
          {(model) => children(new PseudoWordsGenerator(model, rng()))}
        </PhoneticModelLoader>
      );
    case "book":
      return (
        <BookContentLoader book={textSource.book}>
          {(bookContent) =>
            children(new BookParagraphsGenerator(textSource, bookContent))
          }
        </BookContentLoader>
      );
  }
}

function rng(): RNGStream {
  return LCG(Date.now());
}
