import { type CodePoint } from "@keybr/unicode";

export type KeyId = string;

export type HasCodePoint = {
  readonly codePoint: CodePoint;
};

export type FingerId =
  | "pinky"
  | "ring"
  | "middle"
  | "indexLeft"
  | "indexRight"
  | "thumb";

export type CodePointDict = {
  readonly [id: KeyId]: readonly [
    a?: CodePoint,
    b?: CodePoint,
    c?: CodePoint,
    d?: CodePoint,
  ];
};

export type GeometryDict = {
  readonly [id: KeyId]: {
    readonly x: number;
    readonly y: number;
    readonly w?: number;
    readonly h?: number;
    readonly rx?: number;
    readonly ry?: number;
    readonly ra?: number;
    readonly shape?: string;
    readonly finger?: FingerId;
    readonly features?: readonly string[];
  };
};
