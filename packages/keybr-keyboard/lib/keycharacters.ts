import { isNumber } from "@keybr/lang";
import { type CodePoint } from "@keybr/unicode";
import { KeyModifier } from "./keymodifier.ts";
import { type Character, type KeyId } from "./types.ts";

export class KeyCharacters {
  static isCodePoint = (
    character: Character | null,
  ): character is CodePoint => {
    return isNumber(character) && character > 0x0000;
  };

  constructor(
    readonly id: KeyId,
    readonly a: Character | null,
    readonly b: Character | null,
    readonly c: Character | null,
    readonly d: Character | null,
  ) {}

  getCodePoint(modifier: KeyModifier): CodePoint | 0x0000 {
    const { a, b, c, d } = this;
    switch (modifier) {
      case KeyModifier.None:
        return a ?? 0x0000;
      case KeyModifier.Shift:
        return b ?? a ?? 0x0000;
      case KeyModifier.Alt:
        return c ?? b ?? a ?? 0x0000;
      case KeyModifier.ShiftAlt:
        return d ?? c ?? b ?? a ?? 0x0000;
      default:
        throw new Error();
    }
  }
}
