import { type GeometryDict } from "../types.ts";
import { EXTRA } from "./extra.ts";
import { ISO_102 } from "./iso_102.ts";

export const ISO_102_FULL: GeometryDict = {
  ...ISO_102,
  ...EXTRA,
};
