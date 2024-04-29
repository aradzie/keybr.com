import { readFileSync } from "node:fs";
import { type KeyId } from "@keybr/keyboard";
import { pathTo } from "../root.ts";
import { characterKeys } from "./keys.ts";
import { type CodePointList, type KeyMap } from "./layout.ts";

export function importKeymap(filename: string): KeyMap {
  return JSON.parse(readFileSync(pathTo(filename), "utf-8"));
}

/**
 * Layout data as a two-dimensional array.
 *
 * ```
 * [
 *    ["`~", "1!", ...], // Backspace row.
 *    ["qQ", "wW", ...], // Tab row.
 *    ["aA", "sS", ...], // CapsLock row.
 *    ["zZ", "xX", ...], // Shift row.
 * ]
 * ```
 */
export type KeyList = readonly (readonly CodePointList[])[];

/**
 * Parses the given layout data for the ANSI geometry.
 */
export function parseAnsiLayout(data: KeyList): KeyMap {
  return parseLayout(ansiGeometry, data);
}

/**
 * Parses the given layout data for the ISO geometry.
 */
export function parseIsoLayout(data: KeyList): KeyMap {
  return parseLayout(isoGeometry, data);
}

export function parseLayout(
  geometry: readonly (readonly KeyId[])[],
  data: KeyList,
): KeyMap {
  const map = new Map<KeyId, CodePointList>();
  if (geometry.length !== data.length) {
    throw new TypeError(
      `Wrong number of rows, ` +
        `expected ${geometry.length}, ` +
        `got ${data.length}`,
    );
  }
  for (let i = 0; i < geometry.length; i++) {
    const geometryRow = geometry[i];
    const dataRow = data[i];
    if (geometryRow.length !== dataRow.length) {
      throw new TypeError(
        `Wrong number of keys in row ${i}, ` +
          `expected ${geometryRow.length}, ` +
          `actual ${dataRow.length}`,
      );
    }
    for (let j = 0; j < geometryRow.length; j++) {
      map.set(geometryRow[j], dataRow[j]);
    }
  }
  if (!map.has("IntlBackslash") && map.has("Backslash")) {
    map.set("IntlBackslash", map.get("Backslash")!);
  }
  return {
    ...Object.fromEntries(
      [...map].sort(
        (a, b) => characterKeys.indexOf(a[0]) - characterKeys.indexOf(b[0]),
      ),
    ),
    Space: " ",
  };
}

/**
 * Maps row and column indices to key identifiers of the ANSI geometry.
 */
export const ansiGeometry: readonly (readonly KeyId[])[] = [
  [
    "Backquote",
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    "Digit0",
    "Minus",
    "Equal",
  ],
  [
    "KeyQ",
    "KeyW",
    "KeyE",
    "KeyR",
    "KeyT",
    "KeyY",
    "KeyU",
    "KeyI",
    "KeyO",
    "KeyP",
    "BracketLeft",
    "BracketRight",
    "Backslash",
  ],
  [
    "KeyA",
    "KeyS",
    "KeyD",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyJ",
    "KeyK",
    "KeyL",
    "Semicolon",
    "Quote",
  ],
  [
    "KeyZ",
    "KeyX",
    "KeyC",
    "KeyV",
    "KeyB",
    "KeyN",
    "KeyM",
    "Comma",
    "Period",
    "Slash",
  ],
];

/**
 * Maps row and column indices to key identifiers of the ISO geometry.
 */
export const isoGeometry: readonly (readonly KeyId[])[] = [
  [
    "Backquote",
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    "Digit0",
    "Minus",
    "Equal",
  ],
  [
    "KeyQ",
    "KeyW",
    "KeyE",
    "KeyR",
    "KeyT",
    "KeyY",
    "KeyU",
    "KeyI",
    "KeyO",
    "KeyP",
    "BracketLeft",
    "BracketRight",
  ],
  [
    "KeyA",
    "KeyS",
    "KeyD",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyJ",
    "KeyK",
    "KeyL",
    "Semicolon",
    "Quote",
    "Backslash",
  ],
  [
    "IntlBackslash",
    "KeyZ",
    "KeyX",
    "KeyC",
    "KeyV",
    "KeyB",
    "KeyN",
    "KeyM",
    "Comma",
    "Period",
    "Slash",
  ],
];
