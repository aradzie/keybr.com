import { type GeometryDict } from "../types.ts";
import { EXTRA } from "./extra.ts";
import { KOREAN_103 } from "./korean_103.ts";

export const KOREAN_103_FULL: GeometryDict = {
  ...KOREAN_103,
  ...EXTRA,
};
