import { type CodePoint } from "@keybr/unicode";
import { KeyModifier } from "./keymodifier.ts";
import { type KeyId } from "./types.ts";

export class KeyCharacters {
  constructor(
    readonly id: KeyId,
    readonly a: CodePoint,
    readonly b: CodePoint,
    readonly c: CodePoint,
    readonly d: CodePoint,
  ) {}

  codePoint(modifier: KeyModifier): CodePoint {
    const { a, b, c, d } = this;
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
}
