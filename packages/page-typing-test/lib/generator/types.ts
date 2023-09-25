import { type Book } from "@keybr/content-books";
import { type Language } from "@keybr/layout";

export type CommonWordsSource = {
  readonly type: "common-words";
  readonly language: Language;
};

export type PseudoWordsSource = {
  readonly type: "pseudo-words";
  readonly language: Language;
};

export type BookSource = {
  readonly type: "book";
  readonly book: Book;
  readonly paragraphIndex: number;
  readonly capitals: boolean;
  readonly punctuators: boolean;
};

export type TextSource = CommonWordsSource | PseudoWordsSource | BookSource;

export type TextGenerator<MarkT = unknown> = {
  nextWord(): string;
  mark(): MarkT;
  reset(state: MarkT): void;
};

export type Mark = unknown;
