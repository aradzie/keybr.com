import { ANSI_101 } from "./data/geometry/ansi_101.ts";
import { ANSI_101_FULL } from "./data/geometry/ansi_101_full.ts";
import { BRAZILIAN_104 } from "./data/geometry/brazilian_104.ts";
import { BRAZILIAN_104_FULL } from "./data/geometry/brazilian_104_full.ts";
import { ISO_102 } from "./data/geometry/iso_102.ts";
import { ISO_102_FULL } from "./data/geometry/iso_102_full.ts";
import { JAPANESE_106 } from "./data/geometry/japanese_106.ts";
import { JAPANESE_106_FULL } from "./data/geometry/japanese_106_full.ts";
import { KOREAN_103 } from "./data/geometry/korean_103.ts";
import { KOREAN_103_FULL } from "./data/geometry/korean_103_full.ts";
import { MATRIX } from "./data/geometry/matrix.ts";
import { LAYOUT_BE_BY_WIN } from "./data/layout/be_by-win.ts";
import { LAYOUT_CS_CZ_WIN } from "./data/layout/cs_cz-win.ts";
import { LAYOUT_DE_BONE } from "./data/layout/de_bone.ts";
import { LAYOUT_DE_CH_WIN } from "./data/layout/de_ch-win.ts";
import { LAYOUT_DE_DE_WIN } from "./data/layout/de_de-win.ts";
import { LAYOUT_DE_MINE } from "./data/layout/de_mine.ts";
import { LAYOUT_DE_NEO_2 } from "./data/layout/de_neo_2.ts";
import { LAYOUT_DE_NOTED } from "./data/layout/de_noted.ts";
import { LAYOUT_EL_GR_WIN } from "./data/layout/el_gr-win.ts";
import { LAYOUT_EN_CANARY } from "./data/layout/en_canary.ts";
import { LAYOUT_EN_CANARY_MATRIX } from "./data/layout/en_canary_matrix.ts";
import { LAYOUT_EN_COLEMAK } from "./data/layout/en_colemak.ts";
import { LAYOUT_EN_COLEMAK_DH_ANSI } from "./data/layout/en_colemak_dh_ansi.ts";
import { LAYOUT_EN_COLEMAK_DH_ANSI_WIDE } from "./data/layout/en_colemak_dh_ansi_wide.ts";
import { LAYOUT_EN_COLEMAK_DH_ISO } from "./data/layout/en_colemak_dh_iso.ts";
import { LAYOUT_EN_COLEMAK_DH_ISO_WIDE } from "./data/layout/en_colemak_dh_iso_wide.ts";
import { LAYOUT_EN_COLEMAK_DH_MATRIX } from "./data/layout/en_colemak_dh_matrix.ts";
import { LAYOUT_EN_DVORAK_WIN } from "./data/layout/en_dvorak-win.ts";
import { LAYOUT_EN_HALMAK } from "./data/layout/en_halmak.ts";
import { LAYOUT_EN_NORMAN } from "./data/layout/en_norman.ts";
import { LAYOUT_EN_UK_WIN } from "./data/layout/en_uk-win.ts";
import { LAYOUT_EN_US_WIN } from "./data/layout/en_us-win.ts";
import { LAYOUT_EN_WORKMAN } from "./data/layout/en_workman.ts";
import { LAYOUT_ES_ES_WIN } from "./data/layout/es_es-win.ts";
import { LAYOUT_FR_BEPO } from "./data/layout/fr_bepo.ts";
import { LAYOUT_FR_CA_WIN } from "./data/layout/fr_ca-win.ts";
import { LAYOUT_FR_CH_WIN } from "./data/layout/fr_ch-win.ts";
import { LAYOUT_FR_ERGLACE } from "./data/layout/fr_erglace.ts";
import { LAYOUT_FR_ERGO_L } from "./data/layout/fr_ergo_l.ts";
import { LAYOUT_FR_FR_WIN } from "./data/layout/fr_fr-win.ts";
import { LAYOUT_FR_OPTIMOT_ERGO } from "./data/layout/fr_optimot_ergo.ts";
import { LAYOUT_HE_IL_WIN } from "./data/layout/he_il-win.ts";
import { LAYOUT_HU_HU_WIN } from "./data/layout/hu_hu-win.ts";
import { LAYOUT_IT_IT_WIN } from "./data/layout/it_it-win.ts";
import { LAYOUT_JA_JP_JIS } from "./data/layout/ja_jp_jis.ts";
import { LAYOUT_NB_NO_WIN } from "./data/layout/nb_no-win.ts";
import { LAYOUT_NL_BE_WIN } from "./data/layout/nl_be-win.ts";
import { LAYOUT_NL_NL_WIN } from "./data/layout/nl_nl-win.ts";
import { LAYOUT_PL_PL_WIN } from "./data/layout/pl_pl-win.ts";
import { LAYOUT_PT_BR_WIN } from "./data/layout/pt_br-win.ts";
import { LAYOUT_PT_PT_WIN } from "./data/layout/pt_pt-win.ts";
import { LAYOUT_RU_RU_WIN } from "./data/layout/ru_ru-win.ts";
import { LAYOUT_SL_SI_WIN } from "./data/layout/sl_si-win.ts";
import { LAYOUT_SV_SE_WIN } from "./data/layout/sv_se-win.ts";
import { LAYOUT_TR_TR_F_WIN } from "./data/layout/tr_tr_f-win.ts";
import { LAYOUT_TR_TR_Q_WIN } from "./data/layout/tr_tr_q-win.ts";
import { LAYOUT_UK_UA_WIN } from "./data/layout/uk_ua-win.ts";
import { Geometry } from "./geometry.ts";
import { Keyboard } from "./keyboard.ts";
import { Layout } from "./layout.ts";
import { KeyboardOptions } from "./settings.ts";
import { type CodePointDict, type GeometryDict } from "./types.ts";

const layoutDict = new Map<Layout, CodePointDict>([
  [Layout.BE_BY, LAYOUT_BE_BY_WIN],
  [Layout.CS_CZ, LAYOUT_CS_CZ_WIN],
  [Layout.DE_BONE, LAYOUT_DE_BONE],
  [Layout.DE_CH, LAYOUT_DE_CH_WIN],
  [Layout.DE_DE, LAYOUT_DE_DE_WIN],
  [Layout.DE_MINE, LAYOUT_DE_MINE],
  [Layout.DE_NEO_2, LAYOUT_DE_NEO_2],
  [Layout.DE_NOTED, LAYOUT_DE_NOTED],
  [Layout.EL_GR, LAYOUT_EL_GR_WIN],
  [Layout.EN_CANARY, LAYOUT_EN_CANARY],
  [Layout.EN_CANARY_MATRIX, LAYOUT_EN_CANARY_MATRIX],
  [Layout.EN_COLEMAK, LAYOUT_EN_COLEMAK],
  [Layout.EN_COLEMAK_DH_ANSI, LAYOUT_EN_COLEMAK_DH_ANSI],
  [Layout.EN_COLEMAK_DH_ANSI_WIDE, LAYOUT_EN_COLEMAK_DH_ANSI_WIDE],
  [Layout.EN_COLEMAK_DH_ISO, LAYOUT_EN_COLEMAK_DH_ISO],
  [Layout.EN_COLEMAK_DH_ISO_WIDE, LAYOUT_EN_COLEMAK_DH_ISO_WIDE],
  [Layout.EN_COLEMAK_DH_MATRIX, LAYOUT_EN_COLEMAK_DH_MATRIX],
  [Layout.EN_DVORAK, LAYOUT_EN_DVORAK_WIN],
  [Layout.EN_HALMAK, LAYOUT_EN_HALMAK],
  [Layout.EN_JP, LAYOUT_JA_JP_JIS],
  [Layout.EN_NORMAN, LAYOUT_EN_NORMAN],
  [Layout.EN_UK, LAYOUT_EN_UK_WIN],
  [Layout.EN_US, LAYOUT_EN_US_WIN],
  [Layout.EN_WORKMAN, LAYOUT_EN_WORKMAN],
  [Layout.ES_ES, LAYOUT_ES_ES_WIN],
  [Layout.FR_BEPO, LAYOUT_FR_BEPO],
  [Layout.FR_CA, LAYOUT_FR_CA_WIN],
  [Layout.FR_CH, LAYOUT_FR_CH_WIN],
  [Layout.FR_ERGLACE, LAYOUT_FR_ERGLACE],
  [Layout.FR_ERGO_L, LAYOUT_FR_ERGO_L],
  [Layout.FR_FR, LAYOUT_FR_FR_WIN],
  [Layout.FR_OPTIMOT_ERGO, LAYOUT_FR_OPTIMOT_ERGO],
  [Layout.HE_IL, LAYOUT_HE_IL_WIN],
  [Layout.HU_HU, LAYOUT_HU_HU_WIN],
  [Layout.IT_IT, LAYOUT_IT_IT_WIN],
  [Layout.NB_NO, LAYOUT_NB_NO_WIN],
  [Layout.NL_BE, LAYOUT_NL_BE_WIN],
  [Layout.NL_NL, LAYOUT_NL_NL_WIN],
  [Layout.PL_PL, LAYOUT_PL_PL_WIN],
  [Layout.PT_BR, LAYOUT_PT_BR_WIN],
  [Layout.PT_PT, LAYOUT_PT_PT_WIN],
  [Layout.RU_RU, LAYOUT_RU_RU_WIN],
  [Layout.SL_SI, LAYOUT_SL_SI_WIN],
  [Layout.SV_SE, LAYOUT_SV_SE_WIN],
  [Layout.TR_TR_F, LAYOUT_TR_TR_F_WIN],
  [Layout.TR_TR_Q, LAYOUT_TR_TR_Q_WIN],
  [Layout.UK_UA, LAYOUT_UK_UA_WIN],
]);

const geometryDict = new Map<Geometry, GeometryDict>([
  [Geometry.ANSI_101, ANSI_101],
  [Geometry.ANSI_101_FULL, ANSI_101_FULL],
  [Geometry.BRAZILIAN_104, BRAZILIAN_104],
  [Geometry.BRAZILIAN_104_FULL, BRAZILIAN_104_FULL],
  [Geometry.ISO_102, ISO_102],
  [Geometry.ISO_102_FULL, ISO_102_FULL],
  [Geometry.JAPANESE_106, JAPANESE_106],
  [Geometry.JAPANESE_106_FULL, JAPANESE_106_FULL],
  [Geometry.KOREAN_103, KOREAN_103],
  [Geometry.KOREAN_103_FULL, KOREAN_103_FULL],
  [Geometry.MATRIX, MATRIX],
]);

export function loadKeyboard(options: KeyboardOptions): Keyboard;
export function loadKeyboard(layout: Layout): Keyboard;
export function loadKeyboard(layout: Layout, geometry: Geometry): Keyboard;
export function loadKeyboard(...args: any[]): Keyboard {
  const l = args.length;
  let options: KeyboardOptions, layout: Layout, geometry: Geometry;
  if (l === 1 && (options = args[0]) instanceof KeyboardOptions) {
    const { layout, geometry } = options;
    return loadImpl(layout, geometry);
  }
  if (l === 1 && (layout = args[0]) instanceof Layout) {
    const [geometry] = layout.geometries;
    return loadImpl(layout, geometry);
  }
  if (
    l === 2 &&
    (layout = args[0]) instanceof Layout &&
    (geometry = args[1]) instanceof Geometry
  ) {
    return loadImpl(layout, geometry);
  }
  throw new TypeError();
}

function loadImpl(layout: Layout, geometry: Geometry): Keyboard {
  return new Keyboard(
    layout,
    layoutDict.get(layout)!,
    geometryDict.get(geometry)!,
  );
}
