/**
 * This script takes keyboard layout definitions in various formats and generates
 * TypeScript files with the same layouts converted into our own internal representation.
 */

import { join } from "node:path";
import { importCldr } from "./import/cldr.ts";
import { importKalamine } from "./import/kalamine.ts";
import { importKlc } from "./import/klc.ts";
import LAYOUT_DE_BONE from "./layout/de_bone.ts";
import LAYOUT_DE_MINE from "./layout/de_mine.ts";
import LAYOUT_DE_NEO_2 from "./layout/de_neo_2.ts";
import LAYOUT_DE_NOTED from "./layout/de_noted.ts";
import LAYOUT_EN_CANARY from "./layout/en_canary.ts";
import LAYOUT_EN_CANARY_MATRIX from "./layout/en_canary_matrix.ts";
import LAYOUT_EN_DVORAK_PROG from "./layout/en_dvorak_prog.ts";
import LAYOUT_EN_HALMAK from "./layout/en_halmak.ts";
import LAYOUT_EN_NORMAN from "./layout/en_norman.ts";
import LAYOUT_EN_WORKMAN from "./layout/en_workman.ts";
import LAYOUT_EN_WORKMAN_PROG from "./layout/en_workman_prog.ts";
import LAYOUT_FR_BEPO from "./layout/fr_bepo.json";
import LAYOUT_FR_ERGLACE from "./layout/fr_erglace.json";
import LAYOUT_FR_ERGO_L from "./layout/fr_ergo_l.json";
import LAYOUT_FR_OPTIMOT_ERGO from "./layout/fr_optimot_ergo.ts";
import LAYOUT_JA_JP_JIS from "./layout/ja_jp_jis.ts";
import { writeGeneratedFile } from "./util/generate.ts";
import { type KeyMap, undead } from "./util/layout.ts";

for (const [output, keymap] of [
  ["be_by.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/be-t-k0-windows.xml")],
  ["cs_cz.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/cs-t-k0-windows.xml")],
  ["de_bone.ts", LAYOUT_DE_BONE],
  ["de_ch.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/de-CH-t-k0-windows.xml")],
  ["de_de.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/de-t-k0-windows.xml")],
  ["de_mine.ts", LAYOUT_DE_MINE],
  ["de_neo_2.ts", LAYOUT_DE_NEO_2],
  ["de_noted.ts", LAYOUT_DE_NOTED],
  ["el_gr.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/el-t-k0-windows.xml")],
  ["en_canary.ts", LAYOUT_EN_CANARY],
  ["en_canary_matrix.ts", LAYOUT_EN_CANARY_MATRIX],
  ["en_colemak.ts", undead(importKlc("lib/layout/colemak.klc"))],
  ["en_colemak_dh_ansi.ts", undead(importKlc("lib/layout/colemak_dh_ansi_us.klc"))],
  ["en_colemak_dh_ansi_wide.ts", undead(importKlc("lib/layout/colemak_dh_ansi_us_wide.klc"))],
  ["en_colemak_dh_iso.ts", undead(importKlc("lib/layout/colemak_dh_iso_uk.klc"))],
  ["en_colemak_dh_iso_wide.ts", undead(importKlc("lib/layout/colemak_dh_iso_uk_wide.klc"))],
  ["en_colemak_dh_matrix.ts", undead(importKlc("lib/layout/colemak_dh_matrix_us.klc"))],
  ["en_dvorak.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/en-t-k0-windows-dvorak.xml")],
  ["en_dvorak_prog.ts", LAYOUT_EN_DVORAK_PROG],
  ["en_dvorakl.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/en-t-k0-windows-dvorakl.xml")],
  ["en_dvorakr.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/en-t-k0-windows-dvorakr.xml")],
  ["en_engram.ts", importKlc("lib/layout/engram.klc")],
  ["en_engrammer.ts", importKlc("lib/layout/engrammer.klc")],
  ["en_halmak.ts", LAYOUT_EN_HALMAK],
  ["en_norman.ts", LAYOUT_EN_NORMAN],
  ["en_uk.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/en-GB-t-k0-windows.xml")],
  ["en_us.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/en-t-k0-windows.xml")],
  ["en_workman.ts", LAYOUT_EN_WORKMAN],
  ["en_workman_prog.ts", LAYOUT_EN_WORKMAN_PROG],
  ["es_es.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/es-t-k0-windows.xml")],
  ["fr_bepo.ts", importKalamine(LAYOUT_FR_BEPO)],
  ["fr_ca.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/fr-CA-t-k0-windows-var.xml")],
  ["fr_ch.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/fr-CH-t-k0-windows.xml")],
  ["fr_erglace.ts", importKalamine(LAYOUT_FR_ERGLACE)],
  ["fr_ergo_l.ts", importKalamine(LAYOUT_FR_ERGO_L)],
  ["fr_fr.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/fr-t-k0-windows.xml")],
  ["fr_optimot_ergo.ts", LAYOUT_FR_OPTIMOT_ERGO],
  ["he_il.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/he-t-k0-windows.xml")],
  ["hu_hu.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/hu-t-k0-windows.xml")],
  ["it_it.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/it-t-k0-windows.xml")],
  ["ja_jp_jis.ts", LAYOUT_JA_JP_JIS],
  ["nb_no.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/nb-t-k0-windows.xml")],
  ["nl_be.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/nl-BE-t-k0-windows.xml")],
  ["nl_nl.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/nl-t-k0-windows.xml")],
  ["pl_pl.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/pl-t-k0-windows-extended.xml")],
  ["pt_br.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/pt-t-k0-windows-var.xml")],
  ["pt_pt.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/pt-PT-t-k0-windows.xml")],
  ["ru_ru.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/ru-t-k0-windows.xml")],
  ["sl_si.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/sl-t-k0-windows.xml")],
  ["sv_se.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/sv-t-k0-windows.xml")],
  ["tr_tr_f.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/tr-t-k0-windows-legacy.xml")],
  ["tr_tr_q.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/tr-t-k0-windows.xml")],
  ["uk_ua.ts", importCldr("cldr-keyboards-43.0/keyboards/windows/uk-t-k0-windows.xml")],
] as [string, KeyMap][]) {
  const filename = join(__dirname, "../../keybr-keyboard/lib/layout", output);
  console.log(filename);
  writeGeneratedFile(keymap, filename);
}
