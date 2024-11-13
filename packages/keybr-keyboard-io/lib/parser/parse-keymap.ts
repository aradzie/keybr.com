import { KeyCharacters, type KeyId, KeyModifier } from "@keybr/keyboard";
import { toCodePoints } from "@keybr/unicode";
import { LayoutBuilder } from "../layoutbuilder.ts";
import { makeDeadCharacter } from "./diacritics.ts";
import { type ParseResult } from "./types.ts";

export function parseKeymap(text: string): ParseResult {
  const result: ParseResult = { layout: new LayoutBuilder(), warnings: [] };
  for (const [key, list] of Object.entries(JSON.parse(text))) {
    if (LayoutBuilder.isKey(key)) {
      parseCharacterList(result, key, list);
    } else {
      result.warnings.push(`Unknown key: ${key}`);
    }
  }
  return result;
}

function parseCharacterList(result: ParseResult, key: KeyId, list: unknown) {
  const { layout, warnings } = result;
  if (typeof list === "string") {
    list = [...toCodePoints(list)];
  }
  if (Array.isArray(list)) {
    const [a = null, b = null, c = null, d = null] = list;
    layout.setOne(key, KeyModifier.None, parseCharacter(a));
    layout.setOne(key, KeyModifier.Shift, parseCharacter(b));
    layout.setOne(key, KeyModifier.Alt, parseCharacter(c));
    layout.setOne(key, KeyModifier.ShiftAlt, parseCharacter(d));
  } else {
    warnings.push(`[${key}] Invalid character list: ${list}`);
  }

  function parseCharacter(character: unknown) {
    if (character) {
      if (
        KeyCharacters.isCodePoint(character) ||
        KeyCharacters.isDead(character) ||
        KeyCharacters.isSpecial(character) ||
        KeyCharacters.isLigature(character)
      ) {
        return character;
      }
      if (typeof character === "string") {
        const a = [...toCodePoints(character)];
        if (a.length === 0) {
          return null;
        }
        if (a.length === 1) {
          return a[0];
        }
        if (a.length === 2 && a[0] === /* "*" */ 0x002a) {
          return makeDeadCharacter(result, key, a[1]);
        }
      }
      warnings.push(`[${key}] Invalid character: ${character}`);
    }
    return null;
  }
}
