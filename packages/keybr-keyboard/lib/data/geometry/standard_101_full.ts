import { type GeometryDict } from "../../types.ts";
import { EXTRA } from "./extra.ts";
import { STANDARD_101 } from "./standard_101.ts";

export const STANDARD_101_FULL: GeometryDict = {
  ...STANDARD_101,
  ...EXTRA,
};
