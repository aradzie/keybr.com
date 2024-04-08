/**
 * This script takes keyboard layout definitions in various formats and generates
 * TypeScript files with the same layouts converted into our own internal representation.
 */

import { join } from "node:path";
import { convertCldr } from "./conv/cldr.ts";
import { convertKalamine } from "./conv/kalamine.ts";
import LAYOUT_DE_BONE from "./layout/de_bone.ts";
import LAYOUT_DE_MINE from "./layout/de_mine.ts";
import LAYOUT_DE_NEO_2 from "./layout/de_neo_2.ts";
import LAYOUT_DE_NOTED from "./layout/de_noted.ts";
import LAYOUT_EN_CANARY from "./layout/en_canary.ts";
import LAYOUT_EN_CANARY_MATRIX from "./layout/en_canary_matrix.ts";
import LAYOUT_EN_COLEMAK from "./layout/en_colemak.ts";
import LAYOUT_EN_COLEMAK_DH from "./layout/en_colemak_dh.ts";
import LAYOUT_EN_COLEMAK_DH_MATRIX from "./layout/en_colemak_dh_matrix.ts";
import LAYOUT_EN_DVORAK_PROG from "./layout/en_dvorak_prog.ts";
import LAYOUT_EN_WORKMAN from "./layout/en_workman.ts";
import LAYOUT_EN_WORKMAN_PROG from "./layout/en_workman_prog.ts";
import LAYOUT_FR_BEPO from "./layout/fr_bepo.json";
import LAYOUT_FR_ERGLACE from "./layout/fr_erglace.json";
import LAYOUT_FR_ERGO_L from "./layout/fr_ergo_l.json";
import LAYOUT_FR_OPTIMOT_ERGO from "./layout/fr_optimot_ergo.ts";
import LAYOUT_JA_JP_JIS from "./layout/ja_jp_jis.ts";
import { writeGeneratedFile } from "./util/generate.ts";
import { type KeyMap } from "./util/layout.ts";

for (const [output, keymap] of [
  ["be_by-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/be-t-k0-windows.xml")],
  ["cs_cz-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/cs-t-k0-windows.xml")],
  ["de_bone.ts", LAYOUT_DE_BONE],
  ["de_ch-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/de-CH-t-k0-windows.xml")],
  ["de_de-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/de-t-k0-windows.xml")],
  ["de_mine.ts", LAYOUT_DE_MINE],
  ["de_neo_2.ts", LAYOUT_DE_NEO_2],
  ["de_noted.ts", LAYOUT_DE_NOTED],
  ["el_gr-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/el-t-k0-windows.xml")],
  ["en_canary.ts", LAYOUT_EN_CANARY],
  ["en_canary_matrix.ts", LAYOUT_EN_CANARY_MATRIX],
  ["en_colemak.ts", LAYOUT_EN_COLEMAK],
  ["en_colemak_dh.ts", LAYOUT_EN_COLEMAK_DH],
  ["en_colemak_dh_matrix.ts", LAYOUT_EN_COLEMAK_DH_MATRIX],
  ["en_dvorak-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/en-t-k0-windows-dvorak.xml")],
  ["en_dvorak_prog.ts", LAYOUT_EN_DVORAK_PROG],
  ["en_dvorakl-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/en-t-k0-windows-dvorakl.xml")],
  ["en_dvorakr-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/en-t-k0-windows-dvorakr.xml")],
  ["en_uk-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/en-GB-t-k0-windows.xml")],
  ["en_us-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/en-t-k0-windows.xml")],
  ["en_workman.ts", LAYOUT_EN_WORKMAN],
  ["en_workman_prog.ts", LAYOUT_EN_WORKMAN_PROG],
  ["es_es-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/es-t-k0-windows.xml")],
  ["fr_bepo.ts", convertKalamine(LAYOUT_FR_BEPO)],
  ["fr_ca-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/fr-CA-t-k0-windows-var.xml")],
  ["fr_ch-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/fr-CH-t-k0-windows.xml")],
  ["fr_erglace.ts", convertKalamine(LAYOUT_FR_ERGLACE)],
  ["fr_ergo_l.ts", convertKalamine(LAYOUT_FR_ERGO_L)],
  ["fr_fr-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/fr-t-k0-windows.xml")],
  ["fr_optimot_ergo.ts", LAYOUT_FR_OPTIMOT_ERGO],
  ["he_il-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/he-t-k0-windows.xml")],
  ["hu_hu-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/hu-t-k0-windows.xml")],
  ["it_it-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/it-t-k0-windows.xml")],
  ["ja_jp_jis.ts", LAYOUT_JA_JP_JIS],
  ["nl_be-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/nl-BE-t-k0-windows.xml")],
  ["nl_nl-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/nl-t-k0-windows.xml")],
  ["pl_pl-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/pl-t-k0-windows-extended.xml")],
  ["pt_br-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/pt-t-k0-windows-var.xml")],
  ["pt_pt-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/pt-PT-t-k0-windows.xml")],
  ["ru_ru-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/ru-t-k0-windows.xml")],
  ["sl_si-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/sl-t-k0-windows.xml")],
  ["sv_se-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/sv-t-k0-windows.xml")],
  ["uk_ua-win.ts", convertCldr("cldr-keyboards-43.0/keyboards/windows/uk-t-k0-windows.xml")],
] as [string, KeyMap][]) {
  const filename = join(__dirname, "../../keybr-keyboard/lib/data/layout", output);
  console.log(filename);
  writeGeneratedFile(keymap, filename);
}
