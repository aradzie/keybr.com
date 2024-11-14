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
  static isCodePoint = (ch: unknown | null): ch is CodePoint => {
    return isNumber(ch) && ch > 0x0000;
  };

  static isDead = (ch: unknown | null): ch is DeadCharacter => {
    return isObject(ch) && "dead" in ch;
  };

  static isSpecial = (ch: unknown | null): ch is SpecialCharacter => {
    return isObject(ch) && "special" in ch;
  };

  static isLigature = (ch: unknown | null): ch is LigatureCharacter => {
    return isObject(ch) && "ligature" in ch;
  };

  readonly id: KeyId;
  readonly a: Character | null;
  readonly b: Character | null;
  readonly c: Character | null;
  readonly d: Character | null;

  constructor(
    id: KeyId,
    a: Character | null,
    b: Character | null,
    c: Character | null,
    d: Character | null,
  ) {
    this.id = id;
    this.a = a || null;
    this.b = b || null;
    this.c = c || null;
    this.d = d || null;
  }

  getCodePoint(modifier: KeyModifier): CodePoint | null {
    switch (modifier) {
      case KeyModifier.None:
        return select(this.a);
      case KeyModifier.Shift:
        return select(this.b, this.a);
      case KeyModifier.Alt:
        return select(this.c, this.b, this.a);
      case KeyModifier.ShiftAlt:
        return select(this.d, this.c, this.b, this.a);
      default:
        throw new Error();
    }
  }

  get valid() {
    return Boolean(this.a || this.b || this.c || this.d);
  }
}

function select(...characters: (Character | null)[]): CodePoint | null {
  for (const character of characters) {
    if (character != null) {
      if (KeyCharacters.isCodePoint(character)) {
        return character;
      } else {
        break;
      }
    }
  }
  return null;
}
