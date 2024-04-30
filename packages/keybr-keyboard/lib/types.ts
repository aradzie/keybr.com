import { type CodePoint } from "@keybr/unicode";

export type WeightedCodePointSet = {
  readonly size: number;
  has(codePoint: CodePoint): boolean;
  weight(codePoint: CodePoint): number;
} & Iterable<CodePoint>;

export type KeyId = string;

export type ZoneId =
  // Finger zones.
  | "pinky"
  | "ring"
  | "middle"
  | "indexLeft"
  | "indexRight"
  | "thumb"
  // Hand zones.
  | "left"
  | "right"
  // Row zones.
  | "digit"
  | "top"
  | "home"
  | "bottom";

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
    readonly labels?: readonly LabelShape[];
    readonly shape?: string;
    readonly zones?: readonly ZoneId[];
    readonly homing?: boolean;
  };
};

/** A static text label on a key cap. */
export type LabelShape = {
  readonly text: string;
  readonly pos?: readonly [x: number, y: number];
  readonly align?: readonly [
    h: /* start */ "s" | /* middle */ "m" | /* end */ "e",
    v: /* bottom */ "b" | /* middle */ "m" | /* top */ "t",
  ];
};
