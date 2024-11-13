import { type Character, KeyCharacters, type KeyId } from "@keybr/keyboard";
import { toCodePoints } from "@keybr/unicode";
import { type CharacterList } from "../json.ts";
import { characterKeys } from "../keys.ts";
import { LayoutBuilder } from "../layoutbuilder.ts";
import { makeDeadCharacter } from "./diacritics.ts";
import { type ParseResult } from "./types.ts";

export function parseKeymap(text: string): ParseResult {
  const result: ParseResult = { layout: new LayoutBuilder(), warnings: [] };
  for (const [key, list] of Object.entries(JSON.parse(text))) {
    const characters = parseCharacterList(result, key, list as CharacterList);
    if (characterKeys.includes(key)) {
      const [a = null, b = null, c = null, d = null] = characters;
      if (a || b || c || d) {
        result.layout.set(new KeyCharacters(key, a, b, c, d));
      } else {
        result.warnings.push(`Key has no characters: ${key}`);
      }
    } else {
      result.warnings.push(`Unknown key: ${key}`);
    }
  }
  return result;
}

function parseCharacterList(
  result: ParseResult,
  key: KeyId,
  list: CharacterList,
): (Character | null)[] {
  if (typeof list === "string") {
    return [...toCodePoints(list)];
  }

  if (Array.isArray(list)) {
    const characters: (Character | null)[] = [];

    for (const item of list) {
      if (item == null || item === 0x0000) {
        characters.push(null);
        continue;
      }

      if (
        KeyCharacters.isCodePoint(item) ||
        KeyCharacters.isDead(item) ||
        KeyCharacters.isSpecial(item) ||
        KeyCharacters.isLigature(item)
      ) {
        characters.push(item);
        continue;
      }

      if (typeof item === "string") {
        const a = [...toCodePoints(item)];

        if (a.length === 0) {
          characters.push(null);
          continue;
        }

        if (a.length === 1) {
          characters.push(a[0]);
          continue;
        }

        if (a.length === 2 && a[0] === /* "*" */ 0x002a) {
          characters.push(makeDeadCharacter(result, key, a[1]));
          continue;
        }
      }

      characters.push(null);
      result.warnings.push(`[${key}] Invalid character: ${item}`);
    }

    return characters;
  }

  result.warnings.push(`[${key}] Invalid character list: ${list}`);
  return [];
}
