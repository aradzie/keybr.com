import { isNumber, isObject } from "@keybr/lang";
import { type CodePoint } from "@keybr/unicode";
import { KeyModifier } from "./keymodifier.ts";
import {
  type Character,
  type DeadCharacter,
  type KeyId,
  type LigatureCharacter,
  type SpecialCharacter,
} from "./types.ts";

export class KeyCharacters {
  static isCodePoint = (ch: Character | null): ch is CodePoint => {
    return isNumber(ch) && ch > 0x0000;
  };

  static isDead = (ch: Character | null): ch is DeadCharacter => {
    return isObject(ch) && "dead" in ch;
  };

  static isSpecial = (ch: Character | null): ch is SpecialCharacter => {
    return isObject(ch) && "special" in ch;
  };

  static isLigature = (ch: Character | null): ch is LigatureCharacter => {
    return isObject(ch) && "ligature" in ch;
  };

  constructor(
    readonly id: KeyId,
    readonly a: Character | null,
    readonly b: Character | null,
    readonly c: Character | null,
    readonly d: Character | null,
  ) {}

  getCodePoint(modifier: KeyModifier): CodePoint | 0x0000 {
    const a = KeyCharacters.isCodePoint(this.a) ? this.a : null;
    const b = KeyCharacters.isCodePoint(this.b) ? this.b : null;
    const c = KeyCharacters.isCodePoint(this.c) ? this.c : null;
    const d = KeyCharacters.isCodePoint(this.d) ? this.d : null;
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
