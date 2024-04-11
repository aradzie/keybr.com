import { type GeometryDict } from "../types.ts";
import { BRAZILIAN_104 } from "./brazilian_104.ts";
import { EXTRA } from "./extra.ts";

export const BRAZILIAN_104_FULL: GeometryDict = {
  ...BRAZILIAN_104,
  ...EXTRA,
};
