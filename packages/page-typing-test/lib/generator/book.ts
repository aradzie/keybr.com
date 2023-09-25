import {
  type Book,
  type BookContent,
  flattenContent,
  splitParagraph,
} from "@keybr/content-books";
import { type TextGenerator } from "./types.ts";

export type Settings = {
  readonly paragraphIndex: number;
  readonly capitals: boolean;
  readonly punctuators: boolean;
};

type Mark = {
  readonly paragraphIndex: number;
  readonly wordIndex: number;
};

export class BookParagraphsGenerator implements TextGenerator<Mark> {
  private readonly settings: Settings;
  private readonly book: Book;
  private readonly paragraphs: readonly string[];
  private paragraphIndex: number;
  private words: readonly string[] = [];
  private wordIndex: number = 0;

  constructor(settings: Settings, { book, content }: BookContent) {
    const paragraphs = flattenContent(content);
    const paragraphIndex = Math.max(
      0,
      Math.min(paragraphs.length - 1, settings.paragraphIndex),
    );
    this.settings = settings;
    this.book = book;
    this.paragraphs = paragraphs;
    this.paragraphIndex = paragraphIndex;
    this.words = splitParagraph(paragraphs[paragraphIndex]);
    this.wordIndex = 0;
  }

  mark(): Mark {
    return {
      paragraphIndex: this.paragraphIndex,
      wordIndex: this.wordIndex,
    };
  }

  reset({ paragraphIndex, wordIndex }: Mark): void {
    this.paragraphIndex = paragraphIndex;
    this.words = splitParagraph(this.paragraphs[this.paragraphIndex]);
    this.wordIndex = wordIndex;
  }

  nextWord(): string {
    if (this.wordIndex >= this.words.length) {
      this.paragraphIndex += 1;
      if (this.paragraphIndex >= this.paragraphs.length) {
        this.paragraphIndex = 0;
      }
      this.words = splitParagraph(this.paragraphs[this.paragraphIndex]);
      this.wordIndex = 0;
    }
    const word = this.words[this.wordIndex];
    this.wordIndex += 1;
    return word;
  }
}
