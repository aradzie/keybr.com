import { KeyModifier } from "./keymodifier.ts";
import { type CodePoint, type KeyId } from "./types.ts";

export type KeyCodePoints = {
  readonly a: CodePoint; // []
  readonly b: CodePoint; // [shift]
  readonly c: CodePoint; // [alt]
  readonly d: CodePoint; // [shift, alt]
};

export type KeyGeometry = {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly shape: string;
  readonly finger: string | null;
};

export class KeyboardKey {
  constructor(
    readonly id: KeyId,
    readonly codePoints: KeyCodePoints,
    readonly geometry: KeyGeometry,
  ) {}

  codePoint(modifier: KeyModifier): number {
    const { a, b, c, d } = this.codePoints;
    switch (modifier) {
      case KeyModifier.None:
        return a;
      case KeyModifier.Shift:
        return b || a;
      case KeyModifier.Alt:
        return c || b || a;
      case KeyModifier.ShiftAlt:
        return d || c || b || a;
      default:
        throw new Error();
    }
  }

  static special(
    id: KeyId,
    { x, y, w, h, shape, finger }: KeyGeometry,
  ): KeyboardKey {
    return new KeyboardKey(
      id,
      { a: 0, b: 0, c: 0, d: 0 },
      { x, y, w, h, shape, finger },
    );
  }
}

export const visualSortKeys = (a: KeyboardKey, b: KeyboardKey): number => {
  return a.geometry.y - b.geometry.y || a.geometry.x - b.geometry.x;
};
