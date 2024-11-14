import {
  type Character,
  type CharacterDict,
  KeyCharacters,
  type KeyId,
  KeyModifier,
} from "@keybr/keyboard";
import { isDiacritic } from "@keybr/unicode";
import { type CharacterList, type KeyMap } from "./json.ts";
import { characterKeys } from "./keys.ts";
import { formatDeadCharacter } from "./parser/diacritics.ts";

export class LayoutBuilder implements Iterable<KeyCharacters> {
  static isKey(key: KeyId): boolean {
    return characterKeys.includes(key);
  }

  static allKeys(): readonly KeyId[] {
    return characterKeys;
  }

  static from(dict: CharacterDict): LayoutBuilder {
    const builder = new LayoutBuilder();
    for (const [
      key,
      [a = null, b = null, c = null, d = null],
    ] of Object.entries(dict)) {
      builder.setAll(key, a, b, c, d);
    }
    return builder;
  }

  readonly #data = new Map<KeyId, KeyCharacters>();

  constructor(that: LayoutBuilder | null = null) {
    if (that != null) {
      for (const character of that) {
        this.set(character);
      }
    }
  }

  *[Symbol.iterator](): IterableIterator<KeyCharacters> {
    for (const key of characterKeys) {
      const characters = this.#data.get(key);
      if (characters != null && characters.valid) {
        yield characters;
      }
    }
  }

  get size(): number {
    return this.#data.size;
  }

  get(key: KeyId): KeyCharacters | null {
    if (!LayoutBuilder.isKey(key)) {
      throw new TypeError(key);
    }
    return this.#data.get(key) ?? null;
  }

  set(characters: KeyCharacters) {
    const { id } = characters;
    if (!LayoutBuilder.isKey(id)) {
      throw new TypeError(id);
    }
    this.#data.set(id, characters);
    return this;
  }

  getOne(key: KeyId, mod: KeyModifier): Character | null {
    const { a = null, b = null, c = null, d = null } = this.get(key) ?? {};
    switch (mod) {
      case KeyModifier.None:
        return a;
      case KeyModifier.Shift:
        return b;
      case KeyModifier.Alt:
        return c;
      case KeyModifier.ShiftAlt:
        return d;
    }
    return null;
  }

  setOne(key: KeyId, mod: KeyModifier, character: Character | null) {
    const { a = null, b = null, c = null, d = null } = this.get(key) ?? {};
    switch (mod) {
      case KeyModifier.None:
        this.set(new KeyCharacters(key, fix(character), b, c, d));
        break;
      case KeyModifier.Shift:
        this.set(new KeyCharacters(key, a, fix(character), c, d));
        break;
      case KeyModifier.Alt:
        this.set(new KeyCharacters(key, a, b, fix(character), d));
        break;
      case KeyModifier.ShiftAlt:
        this.set(new KeyCharacters(key, a, b, c, fix(character)));
        break;
    }
    return this;
  }

  setAll(
    key: KeyId,
    a: Character | null,
    b: Character | null,
    c: Character | null,
    d: Character | null,
  ) {
    this.setOne(key, KeyModifier.None, a);
    this.setOne(key, KeyModifier.Shift, b);
    this.setOne(key, KeyModifier.Alt, c);
    this.setOne(key, KeyModifier.ShiftAlt, d);
    return this;
  }

  dict(): CharacterDict {
    const dict: { [id: KeyId]: (Character | null)[] } = {};
    for (const { id, a, b, c, d } of this) {
      dict[id] = [a, b, c, d];
    }
    return dict;
  }

  toJSON(): KeyMap {
    const keymap: { [id: KeyId]: CharacterList } = {};
    for (const { id, a, b, c, d } of this) {
      const list = [a, b, c, d];
      while (list.length > 0 && list.at(-1) == null) {
        list.pop();
      }
      if (list.every((character) => KeyCharacters.isCodePoint(character))) {
        keymap[id] = String.fromCodePoint(...list);
      } else {
        keymap[id] = list.map((character) => {
          if (KeyCharacters.isCodePoint(character)) {
            return String.fromCodePoint(character);
          }
          if (KeyCharacters.isDead(character)) {
            return formatDeadCharacter(character);
          }
          if (KeyCharacters.isSpecial(character)) {
            return character.special;
          }
          return character;
        });
      }
    }
    return keymap;
  }
}

function fix(character: Character | null): Character | null {
  if (KeyCharacters.isCodePoint(character)) {
    switch (character) {
      case /* ZERO WIDTH NON-JOINER */ 0x200c:
      case /* ZERO WIDTH JOINER */ 0x200d:
      case /* LEFT-TO-RIGHT MARK */ 0x200e:
      case /* RIGHT-TO-LEFT MARK */ 0x200f:
      case /* COMBINING GRAPHEME JOINER */ 0x034f:
        return { special: character };
    }
    if (isDiacritic(character)) {
      return { dead: character };
    }
  }
  return character;
}
