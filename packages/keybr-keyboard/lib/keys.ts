import {
  GEOMETRY_CONTROL_PAD,
  GEOMETRY_CURSOR_PAD,
  GEOMETRY_NUM_PAD,
} from "./data/geometry.ts";
import { KeyboardKey } from "./keyboardkey.ts";
import { type CodePointDict, type GeometryDict } from "./types.ts";

export const makeKeys = (
  codePointDict: CodePointDict,
  geometryDict: GeometryDict,
  full: boolean,
): {
  keys: KeyboardKey[];
  specialKeys: KeyboardKey[];
  extraKeys: KeyboardKey[];
} => {
  const keys: KeyboardKey[] = [];
  const specialKeys: KeyboardKey[] = [];
  const extraKeys: KeyboardKey[] = [];
  for (const [id, codePoints] of Object.entries(codePointDict)) {
    const geometry = geometryDict[id];
    if (geometry != null) {
      const [a = 0, b = 0, c = 0, d = 0] = codePoints;
      const [x, y, w, h, shape, zone = null, finger = null] = geometry;
      keys.push(
        new KeyboardKey(
          id,
          { a, b, c, d },
          { x, y, w, h, shape, zone, finger },
        ),
      );
    }
  }
  for (const [id, geometry] of Object.entries(geometryDict)) {
    const codePoints = codePointDict[id];
    if (codePoints == null) {
      const [x, y, w, h, shape, zone = null, finger = null] = geometry;
      specialKeys.push(
        KeyboardKey.special(id, { x, y, w, h, shape, zone, finger }),
      );
    }
  }
  if (full) {
    for (const g of [
      GEOMETRY_CONTROL_PAD,
      GEOMETRY_CURSOR_PAD,
      GEOMETRY_NUM_PAD,
    ]) {
      for (const [
        id,
        [x, y, w, h, shape, zone = null, finger = null],
      ] of Object.entries(g)) {
        extraKeys.push(
          KeyboardKey.special(id, { x, y, w, h, shape, zone, finger }),
        );
      }
    }
  }
  return { keys, specialKeys, extraKeys };
};
