import { Layout } from "@keybr/layout";
import {
  GEOMETRY_ANGLEMOD,
  GEOMETRY_STANDARD_101,
  GEOMETRY_STANDARD_102,
} from "./data/geometry.ts";
import {
  LAYOUT_BE_BY_WIN,
  LAYOUT_DE_CH_WIN,
  LAYOUT_DE_DE_WIN,
  LAYOUT_EN_UK_WIN,
  LAYOUT_EN_US_COLEMAK,
  LAYOUT_EN_US_COLEMAK_DH,
  LAYOUT_EN_US_COLEMAK_DH_MATRIX,
  LAYOUT_EN_US_DVORAK_WIN,
  LAYOUT_EN_US_WIN,
  LAYOUT_EN_US_WORKMAN,
  LAYOUT_ES_ES_WIN,
  LAYOUT_FR_BEPO,
  LAYOUT_FR_CA_WIN,
  LAYOUT_FR_CH_WIN,
  LAYOUT_FR_ERGOL,
  LAYOUT_FR_FR_WIN,
  LAYOUT_FR_OPTIMOT,
  LAYOUT_IT_IT_WIN,
  LAYOUT_PL_PL_WIN,
  LAYOUT_PT_BR_WIN,
  LAYOUT_PT_PT_WIN,
  LAYOUT_RU_RU_WIN,
  LAYOUT_UK_UA_WIN,
} from "./data/layout.ts";
import { Keyboard } from "./keyboard.ts";
import { makeKeys } from "./keys.ts";
import { type CodePointDict, type GeometryDict } from "./types.ts";

const config = ((entries: [Layout, CodePointDict, GeometryDict][]) =>
  new Map<Layout, [CodePointDict, GeometryDict]>(
    entries.map(([layout, codePointDict, geometryDict]) => [
      layout,
      [codePointDict, geometryDict],
    ]),
  ))([
  [Layout.BE_BY, LAYOUT_BE_BY_WIN, GEOMETRY_STANDARD_102],
  [Layout.DE_CH, LAYOUT_DE_CH_WIN, GEOMETRY_STANDARD_102],
  [Layout.DE_DE, LAYOUT_DE_DE_WIN, GEOMETRY_STANDARD_102],
  [Layout.EN_UK, LAYOUT_EN_UK_WIN, GEOMETRY_STANDARD_102],
  [Layout.EN_US, LAYOUT_EN_US_WIN, GEOMETRY_STANDARD_101],
  [Layout.EN_US_COLEMAK, LAYOUT_EN_US_COLEMAK, GEOMETRY_STANDARD_101],
  [Layout.EN_US_COLEMAK_DH, LAYOUT_EN_US_COLEMAK_DH, GEOMETRY_ANGLEMOD],
  [
    Layout.EN_US_COLEMAK_DH_MATRIX,
    LAYOUT_EN_US_COLEMAK_DH_MATRIX,
    GEOMETRY_STANDARD_101,
  ],
  [Layout.EN_US_DVORAK, LAYOUT_EN_US_DVORAK_WIN, GEOMETRY_STANDARD_101],
  [Layout.EN_US_WORKMAN, LAYOUT_EN_US_WORKMAN, GEOMETRY_STANDARD_101],
  [Layout.ES_ES, LAYOUT_ES_ES_WIN, GEOMETRY_STANDARD_102],
  [Layout.FR_BEPO, LAYOUT_FR_BEPO, GEOMETRY_STANDARD_102],
  [Layout.FR_ERGO_L, LAYOUT_FR_ERGOL, GEOMETRY_STANDARD_102],
  [Layout.FR_CA, LAYOUT_FR_CA_WIN, GEOMETRY_STANDARD_102],
  [Layout.FR_CH, LAYOUT_FR_CH_WIN, GEOMETRY_STANDARD_102],
  [Layout.FR_FR, LAYOUT_FR_FR_WIN, GEOMETRY_STANDARD_102],
  [Layout.FR_OPTIMOT, LAYOUT_FR_OPTIMOT, GEOMETRY_STANDARD_102],
  [Layout.IT_IT, LAYOUT_IT_IT_WIN, GEOMETRY_STANDARD_102],
  [Layout.PL_PL, LAYOUT_PL_PL_WIN, GEOMETRY_STANDARD_102],
  [Layout.PT_BR, LAYOUT_PT_BR_WIN, GEOMETRY_STANDARD_102],
  [Layout.PT_PT, LAYOUT_PT_PT_WIN, GEOMETRY_STANDARD_102],
  [Layout.RU_RU, LAYOUT_RU_RU_WIN, GEOMETRY_STANDARD_102],
  [Layout.UK_UA, LAYOUT_UK_UA_WIN, GEOMETRY_STANDARD_102],
]);

export function loadKeyboard(
  layout: Layout,
  { full = true }: { full?: boolean },
): Keyboard {
  const [codePointDict, geometryDict] = config.get(layout)!;
  return new Keyboard(layout, makeKeys(codePointDict, geometryDict, full));
}
