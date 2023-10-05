import { BookContentLoader } from "@keybr/content-books";
import { WordListLoader } from "@keybr/content-words";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { LCG, type RNGStream } from "@keybr/rand";
import { type ReactNode } from "react";
import { type TextSource, TextSourceType } from "../settings.ts";
import { BookParagraphsGenerator } from "./book.ts";
import { CommonWordsGenerator } from "./commonwords.ts";
import { PseudoWordsGenerator } from "./pseudowords.ts";
import { type TextGenerator } from "./types.ts";

export function TextGeneratorLoader({
  textSource,
  children,
}: {
  readonly textSource: TextSource;
  readonly children: (textGenerator: TextGenerator) => ReactNode;
}): ReactNode {
  switch (textSource.type) {
    case TextSourceType.CommonWords:
      return (
        <WordListLoader language={textSource.language}>
          {(wordList) =>
            children(new CommonWordsGenerator(textSource, wordList, rng()))
          }
        </WordListLoader>
      );
    case TextSourceType.PseudoWords:
      return (
        <PhoneticModelLoader language={textSource.language}>
          {(model) => children(new PseudoWordsGenerator(model, rng()))}
        </PhoneticModelLoader>
      );
    case TextSourceType.Book:
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
