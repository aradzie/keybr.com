import { type Character, type KeyId } from "@keybr/keyboard";

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
