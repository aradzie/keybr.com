import { type Geometry } from "./geometry.ts";
import { ANGLE_MOD, ANGLE_WIDE_MOD, type ZoneModDict } from "./geometry/mod.ts";
import { type GeometryDict } from "./types.ts";

export type Mod = (geometry: Geometry, dict: GeometryDict) => GeometryDict;

export const nullMod: Mod = (geometry: Geometry, dict: GeometryDict) => dict;

export const angleMod: Mod = ({ form }, dict) => {
  if (form === "staggered") {
    return remapZones(dict, ANGLE_MOD);
  } else {
    return dict;
  }
};

export const angleWideMod: Mod = ({ form }, dict) => {
  if (form === "staggered") {
    return remapZones(dict, ANGLE_WIDE_MOD);
  } else {
    return dict;
  }
};

export function remapZones(dict: GeometryDict, mod: ZoneModDict): GeometryDict {
  return Object.fromEntries(
    Object.entries(dict).map(
      ([id, { x, y, w, h, labels, shape, zones, homing }]) => [
        id,
        { x, y, w, h, labels, shape, zones: mod[id] ?? zones, homing },
      ],
    ),
  );
}
