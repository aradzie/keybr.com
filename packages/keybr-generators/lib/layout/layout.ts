import {
  type Character,
  type CharacterDict,
  KeyCharacters,
  type KeyId,
} from "@keybr/keyboard";
import { toCodePoints } from "@keybr/unicode";
import { diacritics } from "./diacritics.ts";
import { characterKeys } from "./keys.ts";

/**
 * A list of up to four code points assigned to a physical key.
 */
export type CharacterList = string | readonly (string | Character | null)[];

/**
 * Maps a physical key location to a list of up to four code points.
 *
 * For the physical key locations see [UI Events KeyboardEvent code Values](https://www.w3.org/TR/uievents-code/).
 *
 * The four code points are given for the following key modifiers:
 *
 * 1. No modifier.
 * 2. Shift modifier.
 * 3. AltGr modifier.
 * 3. Shift+AltGr modifier.
 *
 * The code points can be given as:
 *
 * - A string of up to four characters long.
 * - An array of up to four strings or numeric code point values.
 *
 * ```
 * {
 *   KeyQ: "qQ",
 *   KeyW: ["w", "W"],
 *   KeyE: [0x0065, 0x0045],
 *   ...
 * }
 * ```
 *
 * Your keyboard layout can also include [dead keys](https://en.wikipedia.org/wiki/Dead_key).
 *
 * A dead key can be configured as a [combining diacritical mark](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) code point:
 *
 * ```
 * {
 *   KeyQ: [0x0300, ...], // COMBINING GRAVE ACCENT
 *   KeyW: [0x005e, ...], // COMBINING CIRCUMFLEX ACCENT
 *   ...
 * }
 * ```
 *
 * Or as a printable diacritical mark string prefixed with the `"*"` character:
 *
 * ```
 * {
 *   KeyQ: ["*`", ...], // COMBINING GRAVE ACCENT
 *   KeyW: ["*^", ...], // COMBINING CIRCUMFLEX ACCENT
 *   ...
 * }
 * ```
 *
 * Please note that for simplicity we only support dead keys which combine letters with diacritical marks.
 * We do not support dead keys which switch between different alphabets, produce non-letter characters, etc.
 */
export type KeyMap = {
  readonly [key: KeyId]: CharacterList;
};

/**
 * Removes dead keys from the given keyboard layout.
 */
export function undead(keyMap: KeyMap): KeyMap {
  return Object.fromEntries(
    Object.entries(keyMap).map(([id, [a, b]]) => [id, [a, b]]),
  );
}

/**
 * Converts a custom keyboard layout definition to an internal representation.
 */
export function toCharacterDict(keymap: KeyMap): CharacterDict {
  const map = new Map<KeyId, (Character | null)[]>();
  for (const keyId of characterKeys) {
    const characters = keymap[keyId];
    if (characters != null) {
      map.set(keyId, parseCharacters(keyId, characters));
    }
  }
  return { ...Object.fromEntries(map), Space: [0x0020] };
}

export function parseCharacters(
  keyId: KeyId,
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

      if (KeyCharacters.isCodePoint(item)) {
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

        if (a.length === 2) {
          if (a[0] === /* * */ 0x002a) {
            const diacritic = diacritics.get(a[1]);
            if (diacritic) {
              characters.push(diacritic);
              continue;
            }

            characters.push(null);
            console.error(`[${keyId}] Invalid diacritical mark`, item);
            continue;
          }

          characters.push(null);
          console.error(`[${keyId}] Invalid character`, item);
          continue;
        }

        characters.push(null);
        console.error(`[${keyId}] Invalid character`, item);
        continue;
      }

      throw new TypeError(`Invalid character list item [${item}]`);
    }

    return characters;
  }

  throw new TypeError(`Invalid character list [${list}]`);
}
