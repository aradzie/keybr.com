import { type Geometry } from "./geometry.ts";
import { ANGLE_MOD, ANGLE_WIDE_MOD, type ZoneMod } from "./geometry/mod.ts";
import { type GeometryDict } from "./types.ts";

export type Mod = (geometry: Geometry, dict: GeometryDict) => GeometryDict;

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

function remapZones(dict: GeometryDict, mod: ZoneMod): GeometryDict {
  return Object.fromEntries(
    Object.entries(dict).map(
      ([id, { x, y, w, h, labels, shape, zones, homing }]) => [
        id,
        { x, y, w, h, labels, shape, zones: mod[id] ?? zones, homing },
      ],
    ),
  );
}
