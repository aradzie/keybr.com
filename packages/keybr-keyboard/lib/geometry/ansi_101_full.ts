import { type GeometryDict } from "../types.ts";
import { ANSI_101 } from "./ansi_101.ts";
import { EXTRA } from "./extra.ts";

export const ANSI_101_FULL: GeometryDict = {
  ...ANSI_101,
  ...EXTRA,
};
