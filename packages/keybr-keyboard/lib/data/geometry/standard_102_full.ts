import { type GeometryDict } from "../../types.ts";
import { EXTRA } from "./extra.ts";
import { STANDARD_102 } from "./standard_102.ts";

export const STANDARD_102_FULL: GeometryDict = {
  ...STANDARD_102,
  ...EXTRA,
};
