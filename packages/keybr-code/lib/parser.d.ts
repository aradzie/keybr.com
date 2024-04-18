import { type Prod } from "./ast.ts";

declare class SyntaxError extends Error {
  readonly location: Location;
}

declare type Location = {
  readonly start: Position;
  readonly end: Position;
};

declare type Position = {
  readonly column: number;
  readonly line: number;
  readonly offset: number;
};

declare type Rule = {
  readonly name: string;
  readonly p: Prod;
};

declare function parse(
  input: string,
  options?: { readonly grammarSource: string },
): readonly Rule[];
