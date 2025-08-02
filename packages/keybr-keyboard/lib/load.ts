import { Geometry, ZoneMod } from "./geometry.ts";
import { ANSI_101 } from "./geometry/ansi_101.ts";
import { ANSI_101_FULL } from "./geometry/ansi_101_full.ts";
import { BRAZILIAN_104 } from "./geometry/brazilian_104.ts";
import { BRAZILIAN_104_FULL } from "./geometry/brazilian_104_full.ts";
import { ISO_102 } from "./geometry/iso_102.ts";
import { ISO_102_FULL } from "./geometry/iso_102_full.ts";
import { JAPANESE_106 } from "./geometry/japanese_106.ts";
import { JAPANESE_106_FULL } from "./geometry/japanese_106_full.ts";
import { KOREAN_103 } from "./geometry/korean_103.ts";
import { KOREAN_103_FULL } from "./geometry/korean_103_full.ts";
import { MATRIX } from "./geometry/matrix.ts";
import { Keyboard } from "./keyboard.ts";
import { Layout } from "./layout.ts";
import { LAYOUT_AR_SA } from "./layout/ar_sa.ts";
import { LAYOUT_AR_SA_102 } from "./layout/ar_sa_102.ts";
import { LAYOUT_BE_BY } from "./layout/be_by.ts";
import { LAYOUT_CS_CZ } from "./layout/cs_cz.ts";
import { LAYOUT_DA_DK } from "./layout/da_dk.ts";
import { LAYOUT_DE_ADNW_BUT_XCV } from "./layout/de_adnw_but_xcv.ts";
import { LAYOUT_DE_BONE } from "./layout/de_bone.ts";
import { LAYOUT_DE_CH } from "./layout/de_ch.ts";
import { LAYOUT_DE_CMOS } from "./layout/de_cmos.ts";
import { LAYOUT_DE_DE } from "./layout/de_de.ts";
import { LAYOUT_DE_MINE } from "./layout/de_mine.ts";
import { LAYOUT_DE_NEO_2 } from "./layout/de_neo_2.ts";
import { LAYOUT_DE_NOTED } from "./layout/de_noted.ts";
import { LAYOUT_EL_GR } from "./layout/el_gr.ts";
import { LAYOUT_EN_APTV3 } from "./layout/en_aptv3.ts";
import { LAYOUT_EN_CANARY } from "./layout/en_canary.ts";
import { LAYOUT_EN_CANARY_MATRIX } from "./layout/en_canary_matrix.ts";
import { LAYOUT_EN_COLEMAK } from "./layout/en_colemak.ts";
import { LAYOUT_EN_COLEMAK_DH_ANSI } from "./layout/en_colemak_dh_ansi.ts";
import { LAYOUT_EN_COLEMAK_DH_ANSI_WIDE } from "./layout/en_colemak_dh_ansi_wide.ts";
import { LAYOUT_EN_COLEMAK_DH_ISO } from "./layout/en_colemak_dh_iso.ts";
import { LAYOUT_EN_COLEMAK_DH_ISO_WIDE } from "./layout/en_colemak_dh_iso_wide.ts";
import { LAYOUT_EN_COLEMAK_DH_MATRIX } from "./layout/en_colemak_dh_matrix.ts";
import { LAYOUT_EN_DVORAK } from "./layout/en_dvorak.ts";
import { LAYOUT_EN_DVORAK_PROG } from "./layout/en_dvorak_prog.ts";
import { LAYOUT_EN_ENGRAM } from "./layout/en_engram.ts";
import { LAYOUT_EN_ENTHIUM_V6 } from "./layout/en_enthium_v6.ts";
import { LAYOUT_EN_ENTHIUM_V10 } from "./layout/en_enthium_v10.ts";
import { LAYOUT_EN_FOCAL } from "./layout/en_focal.ts";
import { LAYOUT_EN_GALLIUM } from "./layout/en_gallium.ts";
import { LAYOUT_EN_GALLIUM_MATRIX } from "./layout/en_gallium_matrix.ts";
import { LAYOUT_EN_GRAPHITE } from "./layout/en_graphite.ts";
import { LAYOUT_EN_HALMAK } from "./layout/en_halmak.ts";
import { LAYOUT_EN_HANDS_DOWN_NEU } from "./layout/en_hands_down_neu.ts";
import { LAYOUT_EN_HANDS_DOWN_PROMETHIUM } from "./layout/en_hands_down_promethium.ts";
import { LAYOUT_EN_MTGAP } from "./layout/en_mtgap.ts";
import { LAYOUT_EN_NERPS } from "./layout/en_nerps.ts";
import { LAYOUT_EN_NERPS_MATRIX } from "./layout/en_nerps_matrix.ts";
import { LAYOUT_EN_NIGHT_MATRIX } from "./layout/en_night_matrix.ts";
import { LAYOUT_EN_NORMAN } from "./layout/en_norman.ts";
import { LAYOUT_EN_STURDY } from "./layout/en_sturdy.ts";
import { LAYOUT_EN_UK } from "./layout/en_uk.ts";
import { LAYOUT_EN_US } from "./layout/en_us.ts";
import { LAYOUT_EN_WORKMAN } from "./layout/en_workman.ts";
import { LAYOUT_ES_DVORAK } from "./layout/es_dvorak.ts";
import { LAYOUT_ES_ES } from "./layout/es_es.ts";
import { LAYOUT_ES_LATAM_DVORAK } from "./layout/es_latam_dvorak.ts";
import { LAYOUT_ES_MX } from "./layout/es_mx.ts";
import { LAYOUT_FA_IR } from "./layout/fa_ir.ts";
import { LAYOUT_FA_IR_LEGACY } from "./layout/fa_ir_legacy.ts";
import { LAYOUT_FR_BEPO } from "./layout/fr_bepo.ts";
import { LAYOUT_FR_CA } from "./layout/fr_ca.ts";
import { LAYOUT_FR_CH } from "./layout/fr_ch.ts";
import { LAYOUT_FR_ERGLACE } from "./layout/fr_erglace.ts";
import { LAYOUT_FR_ERGO_L } from "./layout/fr_ergo_l.ts";
import { LAYOUT_FR_ERGOPTI } from "./layout/fr_ergopti.ts";
import { LAYOUT_FR_FR } from "./layout/fr_fr.ts";
import { LAYOUT_FR_OPTIMOT_ERGO } from "./layout/fr_optimot_ergo.ts";
import { LAYOUT_HE_IL } from "./layout/he_il.ts";
import { LAYOUT_HE_IL_ARKN } from "./layout/he_il_arkn.ts";
import { LAYOUT_HU_HU } from "./layout/hu_hu.ts";
import { LAYOUT_IT_IT } from "./layout/it_it.ts";
import { LAYOUT_JA_JP_JIS } from "./layout/ja_jp_jis.ts";
import { LAYOUT_LT_LT } from "./layout/lt_lt.ts";
import { LAYOUT_NB_DVORAK } from "./layout/nb_dvorak.ts";
import { LAYOUT_NB_KVIKK } from "./layout/nb_kvikk.ts";
import { LAYOUT_NB_NO } from "./layout/nb_no.ts";
import { LAYOUT_NB_SKARP } from "./layout/nb_skarp.ts";
import { LAYOUT_NL_BE } from "./layout/nl_be.ts";
import { LAYOUT_NL_NL } from "./layout/nl_nl.ts";
import { LAYOUT_PL_FWYR } from "./layout/pl_fwyr.ts";
import { LAYOUT_PL_PL } from "./layout/pl_pl.ts";
import { LAYOUT_PT_BR } from "./layout/pt_br.ts";
import { LAYOUT_PT_PT } from "./layout/pt_pt.ts";
import { LAYOUT_RO_RO } from "./layout/ro_ro.ts";
import { LAYOUT_RU_RU } from "./layout/ru_ru.ts";
import { LAYOUT_SL_SI } from "./layout/sl_si.ts";
import { LAYOUT_SV_SE } from "./layout/sv_se.ts";
import { LAYOUT_TH_TH } from "./layout/th_th.ts";
import { LAYOUT_TH_TH_MAN } from "./layout/th_th_man.ts";
import { LAYOUT_TH_TH_PAT } from "./layout/th_th_pat.ts";
import { LAYOUT_TR_TR_F } from "./layout/tr_tr_f.ts";
import { LAYOUT_TR_TR_Q } from "./layout/tr_tr_q.ts";
import { LAYOUT_UK_UA } from "./layout/uk_ua.ts";
import { nullMod, remapZones } from "./mod.ts";
import { KeyboardOptions } from "./settings.ts";
import { type CharacterDict, type GeometryDict } from "./types.ts";

const layouts = new Map<Layout, CharacterDict>([
  [Layout.AR_SA, LAYOUT_AR_SA],
  [Layout.AR_SA_102, LAYOUT_AR_SA_102],
  [Layout.BE_BY, LAYOUT_BE_BY],
  [Layout.CS_CZ, LAYOUT_CS_CZ],
  [Layout.DA_DK, LAYOUT_DA_DK],
  [Layout.DE_BONE, LAYOUT_DE_BONE],
  [Layout.DE_CH, LAYOUT_DE_CH],
  [Layout.DE_CMOS, LAYOUT_DE_CMOS],
  [Layout.DE_DE, LAYOUT_DE_DE],
  [Layout.DE_MINE, LAYOUT_DE_MINE],
  [Layout.DE_NEO_2, LAYOUT_DE_NEO_2],
  [Layout.DE_NOTED, LAYOUT_DE_NOTED],
  [Layout.EL_GR, LAYOUT_EL_GR],
  [Layout.EN_CANARY, LAYOUT_EN_CANARY],
  [Layout.EN_CANARY_MATRIX, LAYOUT_EN_CANARY_MATRIX],
  [Layout.EN_COLEMAK, LAYOUT_EN_COLEMAK],
  [Layout.EN_COLEMAK_DH_ANSI, LAYOUT_EN_COLEMAK_DH_ANSI],
  [Layout.EN_COLEMAK_DH_ANSI_WIDE, LAYOUT_EN_COLEMAK_DH_ANSI_WIDE],
  [Layout.EN_COLEMAK_DH_ISO, LAYOUT_EN_COLEMAK_DH_ISO],
  [Layout.EN_COLEMAK_DH_ISO_WIDE, LAYOUT_EN_COLEMAK_DH_ISO_WIDE],
  [Layout.EN_COLEMAK_DH_MATRIX, LAYOUT_EN_COLEMAK_DH_MATRIX],
  [Layout.EN_DVORAK, LAYOUT_EN_DVORAK],
  [Layout.EN_DVORAK_PROG, LAYOUT_EN_DVORAK_PROG],
  [Layout.EN_ENGRAM, LAYOUT_EN_ENGRAM],
  [Layout.EN_ENTHIUM_V6, LAYOUT_EN_ENTHIUM_V6],
  [Layout.EN_ENTHIUM_V10, LAYOUT_EN_ENTHIUM_V10],
  [Layout.EN_FOCAL, LAYOUT_EN_FOCAL],
  [Layout.EN_GALLIUM, LAYOUT_EN_GALLIUM],
  [Layout.EN_GALLIUM_MATRIX, LAYOUT_EN_GALLIUM_MATRIX],
  [Layout.EN_GRAPHITE, LAYOUT_EN_GRAPHITE],
  [Layout.EN_HALMAK, LAYOUT_EN_HALMAK],
  [Layout.EN_HANDS_DOWN_NEU, LAYOUT_EN_HANDS_DOWN_NEU],
  [Layout.EN_HANDS_DOWN_PROMETHIUM, LAYOUT_EN_HANDS_DOWN_PROMETHIUM],
  [Layout.EN_MTGAP, LAYOUT_EN_MTGAP],
  [Layout.EN_JP, LAYOUT_JA_JP_JIS],
  [Layout.EN_NERPS, LAYOUT_EN_NERPS],
  [Layout.EN_NERPS_MATRIX, LAYOUT_EN_NERPS_MATRIX],
  [Layout.EN_NIGHT_MATRIX, LAYOUT_EN_NIGHT_MATRIX],
  [Layout.EN_NORMAN, LAYOUT_EN_NORMAN],
  [Layout.EN_STURDY, LAYOUT_EN_STURDY],
  [Layout.EN_APT_v3, LAYOUT_EN_APTV3],
  [Layout.EN_UK, LAYOUT_EN_UK],
  [Layout.EN_US, LAYOUT_EN_US],
  [Layout.EN_WORKMAN, LAYOUT_EN_WORKMAN],
  [Layout.ES_ES, LAYOUT_ES_ES],
  [Layout.ES_MX, LAYOUT_ES_MX],
  [Layout.ES_DVORAK, LAYOUT_ES_DVORAK],
  [Layout.ES_LATAM_DVORAK, LAYOUT_ES_LATAM_DVORAK],
  [Layout.FA_IR, LAYOUT_FA_IR],
  [Layout.FA_IR_LEGACY, LAYOUT_FA_IR_LEGACY],
  [Layout.FR_BEPO, LAYOUT_FR_BEPO],
  [Layout.FR_CA, LAYOUT_FR_CA],
  [Layout.FR_CH, LAYOUT_FR_CH],
  [Layout.FR_ERGLACE, LAYOUT_FR_ERGLACE],
  [Layout.FR_ERGO_L, LAYOUT_FR_ERGO_L],
  [Layout.FR_ERGOPTI, LAYOUT_FR_ERGOPTI],
  [Layout.FR_FR, LAYOUT_FR_FR],
  [Layout.FR_OPTIMOT_ERGO, LAYOUT_FR_OPTIMOT_ERGO],
  [Layout.HE_IL, LAYOUT_HE_IL],
  [Layout.HE_IL_ARKN, LAYOUT_HE_IL_ARKN],
  [Layout.HU_HU, LAYOUT_HU_HU],
  [Layout.IT_IT, LAYOUT_IT_IT],
  [Layout.LT_LT, LAYOUT_LT_LT],
  [Layout.NB_KVIKK, LAYOUT_NB_KVIKK],
  [Layout.NB_NO, LAYOUT_NB_NO],
  [Layout.NB_SKARP, LAYOUT_NB_SKARP],
  [Layout.NB_DVORAK, LAYOUT_NB_DVORAK],
  [Layout.NL_BE, LAYOUT_NL_BE],
  [Layout.NL_NL, LAYOUT_NL_NL],
  [Layout.PL_FWYR, LAYOUT_PL_FWYR],
  [Layout.PL_PL, LAYOUT_PL_PL],
  [Layout.PT_BR, LAYOUT_PT_BR],
  [Layout.PT_PT, LAYOUT_PT_PT],
  [Layout.RO_RO, LAYOUT_RO_RO],
  [Layout.RU_RU, LAYOUT_RU_RU],
  [Layout.SL_SI, LAYOUT_SL_SI],
  [Layout.SV_SE, LAYOUT_SV_SE],
  [Layout.TH_MAN, LAYOUT_TH_TH_MAN],
  [Layout.TH_PAT, LAYOUT_TH_TH_PAT],
  [Layout.TH_TH, LAYOUT_TH_TH],
  [Layout.TR_TR_F, LAYOUT_TR_TR_F],
  [Layout.TR_TR_Q, LAYOUT_TR_TR_Q],
  [Layout.UK_UA, LAYOUT_UK_UA],
  [Layout.DE_ADNW_BUT_XCV, LAYOUT_DE_ADNW_BUT_XCV],
]);

const geometries = new Map<Geometry, GeometryDict>([
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
  const { length } = args;
  let options: KeyboardOptions;
  if (length === 1 && (options = args[0]) instanceof KeyboardOptions) {
    return loadImpl(options.layout, options.geometry, options.zones);
  }
  let layout: Layout;
  if (length === 1 && (layout = args[0]) instanceof Layout) {
    return loadImpl(layout);
  }
  let geometry: Geometry;
  if (
    length === 2 &&
    (layout = args[0]) instanceof Layout &&
    (geometry = args[1]) instanceof Geometry
  ) {
    return loadImpl(layout, geometry);
  }
  throw new TypeError();
}

function loadImpl(
  layout: Layout,
  geometry: Geometry = Geometry.first(layout.geometries),
  zones: ZoneMod = ZoneMod.first(geometry.zones),
): Keyboard {
  let characterDict = layouts.get(layout)!;
  let geometryDict = geometries.get(geometry)!;
  if (layout.mod === nullMod && zones !== ZoneMod.STANDARD) {
    geometryDict = remapZones(geometryDict, zones.mod);
  }
  return new Keyboard(layout, geometry, characterDict, geometryDict);
}
