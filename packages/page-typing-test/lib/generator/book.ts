import {
  type BookContent,
  flattenContent,
  splitParagraph,
} from "@keybr/content-books";
import { type TextGenerator } from "./types.ts";

type BookSettings = {
  readonly paragraphIndex: number;
};

type Mark = {
  readonly paragraphIndex: number;
  readonly wordIndex: number;
};

export class BookParagraphsGenerator implements TextGenerator<Mark> {
  readonly #paragraphs: readonly string[];
  #paragraphIndex: number;
  #words: readonly string[] = [];
  #wordIndex: number = 0;

  constructor(settings: BookSettings, { content }: BookContent) {
    const paragraphs = flattenContent(content);
    const paragraphIndex = Math.max(
      0,
      Math.min(paragraphs.length - 1, settings.paragraphIndex),
    );
    this.#paragraphs = paragraphs;
    this.#paragraphIndex = paragraphIndex;
    this.#words = splitParagraph(paragraphs[paragraphIndex]);
    this.#wordIndex = 0;
  }

  mark(): Mark {
    return {
      paragraphIndex: this.#paragraphIndex,
      wordIndex: this.#wordIndex,
    };
  }

  reset({ paragraphIndex, wordIndex }: Mark): void {
    this.#paragraphIndex = paragraphIndex;
    this.#words = splitParagraph(this.#paragraphs[this.#paragraphIndex]);
    this.#wordIndex = wordIndex;
  }

  nextWord(): string {
    if (this.#wordIndex >= this.#words.length) {
      this.#paragraphIndex += 1;
      if (this.#paragraphIndex >= this.#paragraphs.length) {
        this.#paragraphIndex = 0;
      }
      this.#words = splitParagraph(this.#paragraphs[this.#paragraphIndex]);
      this.#wordIndex = 0;
    }
    const word = this.#words[this.#wordIndex];
    this.#wordIndex += 1;
    return word;
  }
}
