import {
  type CodePoint,
  type CodePointDict,
  isDiacritic,
  type KeyId,
} from "@keybr/keyboard";
import { toCodePoints } from "@keybr/unicode";
import { diacritics } from "./diacritics.ts";
import { allKeys } from "./keys.ts";

export type CodePointList = string | readonly (string | CodePoint)[];

export type LayoutConfig = {
  readonly codePoints: {
    readonly [key: KeyId]: CodePointList;
  };
};

export function toCodePointDict(config: LayoutConfig): CodePointDict {
  const map = new Map<KeyId, CodePoint[]>();
  for (const keyId of allKeys) {
    map.set(keyId, codePointsOf(config.codePoints[keyId]));
  }
  return Object.fromEntries(map) as any;
}

function codePointsOf(list: CodePointList): CodePoint[] {
  const result: CodePoint[] = [];
  if (typeof list === "string") {
    result.push(...toCodePoints(list));
  }
  if (Array.isArray(list)) {
    for (const item of list) {
      if (typeof item === "number") {
        result.push(item);
      }
      if (typeof item === "string") {
        const a = [...toCodePoints(item)];
        if (a.length === 1) {
          result.push(...a);
        }
        if (a.length === 2) {
          if (a[0] === /* * */ 0x002a) {
            const diacritic = diacritics.get(a[1]);
            if (diacritic) {
              result.push(diacritic);
            } else {
              console.error("Unknown dead key", item);
            }
          }
          if (a[0] === /* ◌ */ 0x25cc) {
            if (isDiacritic(a[1])) {
              result.push(a[1]);
            } else {
              console.error("Unknown dead key", item);
            }
          }
        }
      }
    }
  }
  return result;
}
