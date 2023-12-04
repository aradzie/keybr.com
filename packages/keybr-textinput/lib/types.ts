import { type CodePoint } from "@keybr/unicode";

export const attrNormal = 0 as number;
export const attrHit = 1 as number;
export const attrMiss = 2 as number;
export const attrGarbage = 4 as number;
export const attrCursor = 8 as number;

export type Step = {
  readonly codePoint: CodePoint;
  readonly timeStamp: number;
  readonly typo: boolean;
};

export type Char = {
  readonly codePoint: CodePoint;
  readonly attrs: number;
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
