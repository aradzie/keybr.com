/**
 * Converts layout files produced by the Kalamine project into our own internal representation.
 *
 * To get a json file from a kalamine layout definition source:
 *
 * ```sh
 * kalamine build layout.toml --out layout.json
 * ```
 *
 * @see https://github.com/OneDeadKey/kalamine
 */

import { type KeyMap } from "../util/layout.ts";

/**
 * The type of the JSON files produced by the Kalamine project.
 */
type KalamineJson = {
  readonly keymap: Record<string, string[]>;
  readonly deadkeys: Record<string, Record<string, string>>;
  readonly altgr: boolean;
  readonly [_: string]: any;
};

export function importKalamine({ keymap }: KalamineJson): KeyMap {
  return keymap;
}
