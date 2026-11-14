import { Geometry } from "../geometry.ts";
import { type CharacterDict } from "../types.ts";
import { LAYOUT_UK_UA_BASE } from "./uk_ua_base.ts";

const ANSI: CharacterDict = {
  ...LAYOUT_UK_UA_BASE,
  Backquote: [
    /* CYRILLIC SMALL LETTER GHE WITH UPTURN */ 0x0491,
    /* CYRILLIC CAPITAL LETTER GHE WITH UPTURN */ 0x0490,
  ],
  Backslash: [/* MODIFIER LETTER APOSTROPHE */ 0x02bc],
};

const ISO: CharacterDict = {
  ...LAYOUT_UK_UA_BASE,
  Backquote: [/* REVERSE SOLIDUS */ 0x005c],
  Backslash: [/* MODIFIER LETTER APOSTROPHE */ 0x02bc],
  IntlBackslash: [
    /* CYRILLIC SMALL LETTER GHE WITH UPTURN */ 0x0491,
    /* CYRILLIC CAPITAL LETTER GHE WITH UPTURN */ 0x0490,
  ],
};

export const LAYOUT_UK_UA = new Map<Geometry, CharacterDict>([
  [Geometry.ANSI_101, ANSI],
  [Geometry.ANSI_101_FULL, ANSI],
  [Geometry.ISO_102, ISO],
  [Geometry.ISO_102_FULL, ISO],
]);
