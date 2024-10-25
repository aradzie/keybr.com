import { type CodePoint } from "@keybr/unicode";

export const enum Attr {
  Normal = 0,
  Hit = 1,
  Miss = 2,
  Garbage = 4,
  Cursor = 8,
}

export type StyledText = string | StyledTextSpan | readonly StyledText[];

export type StyledTextSpan = { readonly text: string; readonly cls: string };

export type Step = {
  readonly codePoint: CodePoint;
  readonly timeStamp: number;
  readonly typo: boolean;
};

export type Char = {
  readonly codePoint: CodePoint;
  readonly attrs: number;
  readonly cls?: string | null;
};

export type Line = {
  readonly text: string;
  readonly chars: readonly Char[];
};

export type LineList = {
  readonly text: string;
  readonly lines: readonly Line[];
};

export enum Feedback {
  Succeeded,
  Recovered,
  Failed,
}

export type Sample = {
  readonly codePoint: CodePoint;
  readonly hitCount: number;
  readonly missCount: number;
  readonly timeToType: number;
};
