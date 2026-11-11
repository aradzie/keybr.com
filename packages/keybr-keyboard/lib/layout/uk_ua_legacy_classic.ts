import { Geometry } from "../geometry.ts";
import { type CharacterDict } from "../types.ts";
import { LAYOUT_UK_UA_BASE } from "./uk_ua_base.ts";

const ANSI: CharacterDict = {
  ...LAYOUT_UK_UA_BASE,
  Backquote: [/* MODIFIER LETTER APOSTROPHE */ 0x02bc],
  Backslash: [
    /* CYRILLIC SMALL LETTER GHE WITH UPTURN */ 0x0491,
    /* CYRILLIC CAPITAL LETTER GHE WITH UPTURN */ 0x0490,
  ],
  Slash: [/* SOLIDUS */ 0x002f, /* QUESTION MARK */ 0x003f],
};

const ISO: CharacterDict = {
  ...LAYOUT_UK_UA_BASE,
  Backquote: [/* GREATER-THAN SIGN */ 0x003e],
  Backslash: [
    /* CYRILLIC SMALL LETTER GHE WITH UPTURN */ 0x0491,
    /* CYRILLIC CAPITAL LETTER GHE WITH UPTURN */ 0x0490,
  ],
  IntlBackslash: [/* MODIFIER LETTER APOSTROPHE */ 0x02bc],
  Slash: [/* SOLIDUS */ 0x002f, /* QUESTION MARK */ 0x003f],
};

export const LAYOUT_UK_UA_LEGACY_CLASSIC = new Map<Geometry, CharacterDict>([
  [Geometry.ANSI_101, ANSI],
  [Geometry.ANSI_101_FULL, ANSI],
  [Geometry.ISO_102, ISO],
  [Geometry.ISO_102_FULL, ISO],
  [Geometry.MATRIX, LAYOUT_UK_UA_BASE],
]);
