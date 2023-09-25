import { type Book } from "./book.ts";

export type Content = readonly Chapter[];

export type Chapter = readonly [title: string, para: readonly string[]];

export type BookContent = {
  readonly book: Book;
  readonly content: Content;
};
