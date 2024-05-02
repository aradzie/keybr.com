import { isNumber, isObject } from "@keybr/lang";
import { type CodePoint } from "@keybr/unicode";
import { KeyModifier } from "./keymodifier.ts";
import { type Character, type KeyId } from "./types.ts";

const toCodePoint = (character: Character | null): CodePoint | null => {
  return KeyCharacters.isCodePoint(character) ? character : null;
};

export class KeyCharacters {
  static characterType = (character: Character | null) => {
    if (KeyCharacters.isCodePoint(character)) {
      return "codePoint";
    }
    if (KeyCharacters.isDead(character)) {
      return "dead";
    }
    if (KeyCharacters.isSpecial(character)) {
      return "special";
    }
    if (KeyCharacters.isLigature(character)) {
      return "ligature";
    }
    return null;
  };

  static isCodePoint = (
    character: Character | null,
  ): character is CodePoint => {
    return isNumber(character) && character > 0x0000;
  };

  static isDead = (
    character: Character | null,
  ): character is { readonly dead: CodePoint } => {
    return isObject(character) && "dead" in character;
  };

  static isSpecial = (
    character: Character | null,
  ): character is { readonly special: CodePoint } => {
    return isObject(character) && "special" in character;
  };

  static isLigature = (
    character: Character | null,
  ): character is { readonly ligature: string } => {
    return isObject(character) && "ligature" in character;
  };

  constructor(
    readonly id: KeyId,
    readonly a: Character | null,
    readonly b: Character | null,
    readonly c: Character | null,
    readonly d: Character | null,
  ) {}

  getCodePoint(modifier: KeyModifier): CodePoint | 0x0000 {
    const a = toCodePoint(this.a);
    const b = toCodePoint(this.b);
    const c = toCodePoint(this.c);
    const d = toCodePoint(this.d);
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
