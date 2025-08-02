#!/usr/bin/env -S npx tsnode

/**
 * This script takes keyboard layout definitions in various formats and generates
 * TypeScript files with the same layouts converted into our own internal representation.
 */

import { type CharacterDict } from "@keybr/keyboard";
import { writeGeneratedFile } from "./layout/generate.ts";
import { importCldr, importKeymap, importKlc } from "./layout/import.ts";
import { pathTo } from "./root.ts";

for (const [id, layout] of [
  ["ar_sa", importCldr("cldr-keyboards-43.0/keyboards/windows/ar-t-k0-windows.xml")],
  ["ar_sa_102", importCldr("cldr-keyboards-43.0/keyboards/windows/ar-t-k0-windows-102key.xml")],
  ["be_by", importCldr("cldr-keyboards-43.0/keyboards/windows/be-t-k0-windows.xml")],
  ["cs_cz", importCldr("cldr-keyboards-43.0/keyboards/windows/cs-t-k0-windows.xml")],
  ["da_dk", importCldr("cldr-keyboards-43.0/keyboards/windows/da-t-k0-windows.xml")],
  ["de_adnw_but_xcv", importKeymap("layouts/de_adnw_but_xcv.json")],
  ["de_bone", importKeymap("layouts/de_bone.json")],
  ["de_ch", importCldr("cldr-keyboards-43.0/keyboards/windows/de-CH-t-k0-windows.xml")],
  ["de_cmos", importKeymap("layouts/de_cmos.json")],
  ["de_de", importCldr("cldr-keyboards-43.0/keyboards/windows/de-t-k0-windows.xml")],
  ["de_mine", importKeymap("layouts/de_mine.json")],
  ["de_neo_2", importKeymap("layouts/de_neo_2.json")],
  ["de_noted", importKeymap("layouts/de_noted.json")],
  ["el_gr", importCldr("cldr-keyboards-43.0/keyboards/windows/el-t-k0-windows.xml")],
  ["en_canary", importKeymap("layouts/en_canary.json")],
  ["en_canary_matrix", importKeymap("layouts/en_canary_matrix.json")],
  ["en_colemak", undead(importKlc("layouts/colemak.klc"))],
  ["en_colemak_dh_ansi", undead(importKlc("layouts/colemak_dh_ansi_us.klc"))],
  ["en_colemak_dh_ansi_wide", undead(importKlc("layouts/colemak_dh_ansi_us_wide.klc"))],
  ["en_colemak_dh_iso", undead(importKlc("layouts/colemak_dh_iso_uk.klc"))],
  ["en_colemak_dh_iso_wide", undead(importKlc("layouts/colemak_dh_iso_uk_wide.klc"))],
  ["en_colemak_dh_matrix", undead(importKlc("layouts/colemak_dh_matrix_us.klc"))],
  ["en_dvorak", importCldr("cldr-keyboards-43.0/keyboards/windows/en-t-k0-windows-dvorak.xml")],
  ["en_dvorak_l", importCldr("cldr-keyboards-43.0/keyboards/windows/en-t-k0-windows-dvorakl.xml")],
  ["en_dvorak_prog", importKeymap("layouts/en_dvorak_prog.json")],
  ["en_dvorak_r", importCldr("cldr-keyboards-43.0/keyboards/windows/en-t-k0-windows-dvorakr.xml")],
  ["en_engram", importKlc("layouts/engram.klc")],
  ["en_engrammer", importKlc("layouts/engrammer.klc")],
  ["en_enthium_v6", importKeymap("layouts/enthium_v6.json")],
  ["en_enthium_v10", importKeymap("layouts/enthium_v10.json")],
  ["en_gallium", importKlc("layouts/en_gallium.klc")],
  ["en_gallium_matrix", importKlc("layouts/en_gallium_matrix.klc")],
  ["en_graphite", importKeymap("layouts/en_graphite.json")],
  ["en_halmak", importKeymap("layouts/en_halmak.json")],
  ["en_hands_down_neu", importKeymap("layouts/en_hands_down_neu.json")],
  ["en_hands_down_promethium", importKeymap("layouts/en_hands_down_promethium.json")],
  ["en_nerps", importKeymap("layouts/en_nerps.json")],
  ["en_nerps_matrix", importKeymap("layouts/en_nerps_matrix.json")],
  ["en_night_matrix", importKeymap("layouts/en_night_matrix.json")],
  ["en_norman", importKeymap("layouts/en_norman.json")],
  ["en_sturdy", importKeymap("layouts/en_sturdy.json")],
  ["en_uk", importCldr("cldr-keyboards-43.0/keyboards/windows/en-GB-t-k0-windows.xml")],
  ["en_us", importCldr("cldr-keyboards-43.0/keyboards/windows/en-t-k0-windows.xml")],
  ["en_workman", importKeymap("layouts/en_workman.json")],
  ["en_workman_prog", importKeymap("layouts/en_workman_prog.json")],
  ["en_aptv3", importKeymap("layouts/en_aptv3.json")],
  ["en_focal", importKeymap("layouts/en_focal.json")],
  ["es_es", importCldr("cldr-keyboards-43.0/keyboards/windows/es-t-k0-windows.xml")],
  ["es_mx", importCldr("cldr-keyboards-43.0/keyboards/windows/es-419-t-k0-windows.xml")],
  ["es_latam_dvorak", importKeymap("layouts/es_latam_dvorak.json")],
  ["es_dvorak", importKeymap("layouts/es_dvorak.json")],
  ["fa_ir", importCldr("cldr-keyboards-43.0/keyboards/windows/fa-t-k0-windows-extended.xml")],
  ["fa_ir_legacy", importCldr("cldr-keyboards-43.0/keyboards/windows/fa-t-k0-windows.xml")],
  ["fr_bepo", importKeymap("layouts/fr_bepo.json")],
  ["fr_ca", importCldr("cldr-keyboards-43.0/keyboards/windows/fr-CA-t-k0-windows-var.xml")],
  ["fr_ch", importCldr("cldr-keyboards-43.0/keyboards/windows/fr-CH-t-k0-windows.xml")],
  ["fr_erglace", importKeymap("layouts/fr_erglace.json")],
  ["fr_ergo_l", importKeymap("layouts/fr_ergo_l.json")],
  ["fr_fr", importCldr("cldr-keyboards-43.0/keyboards/windows/fr-t-k0-windows.xml")],
  ["fr_optimot_ergo", importKeymap("layouts/fr_optimot_ergo.json")],
  ["fr_ergopti", importKeymap("layouts/fr_ergopti.json")],
  ["he_il", importCldr("layouts/he_il.xml")],
  ["he_il_arkn", importCldr("layouts/he_il_arkn.xml")],
  ["hu_hu", importCldr("cldr-keyboards-43.0/keyboards/windows/hu-t-k0-windows.xml")],
  ["it_it", importCldr("cldr-keyboards-43.0/keyboards/windows/it-t-k0-windows.xml")],
  ["ja_jp_jis", importKeymap("layouts/ja_jp_jis.json")],
  ["lt_lt", importCldr("cldr-keyboards-43.0/keyboards/windows/lt-t-k0-windows-lt1582.xml")],
  ["nb_kvikk", importKeymap("layouts/nb_kvikk.json")],
  ["nb_no", importCldr("cldr-keyboards-43.0/keyboards/windows/nb-t-k0-windows.xml")],
  ["nb_skarp", importKeymap("layouts/nb_skarp.json")],
  ["nb_dvorak", importKeymap("layouts/nb_dvorak.json")],
  ["nl_be", importCldr("cldr-keyboards-43.0/keyboards/windows/nl-BE-t-k0-windows.xml")],
  ["nl_nl", importCldr("cldr-keyboards-43.0/keyboards/windows/nl-t-k0-windows.xml")],
  ["pl_fwyr", importKlc("layouts/pl_fwyr_v5.klc")],
  ["pl_pl", importCldr("cldr-keyboards-43.0/keyboards/windows/pl-t-k0-windows-extended.xml")],
  ["pt_br", importCldr("cldr-keyboards-43.0/keyboards/windows/pt-t-k0-windows-var.xml")],
  ["pt_pt", importCldr("cldr-keyboards-43.0/keyboards/windows/pt-PT-t-k0-windows.xml")],
  ["ro_ro", importCldr("cldr-keyboards-43.0/keyboards/windows/ro-t-k0-windows.xml")],
  ["ru_ru", importCldr("cldr-keyboards-43.0/keyboards/windows/ru-t-k0-windows.xml")],
  ["sl_si", importCldr("cldr-keyboards-43.0/keyboards/windows/sl-t-k0-windows.xml")],
  ["sv_se", importCldr("cldr-keyboards-43.0/keyboards/windows/sv-t-k0-windows.xml")],
  ["th_th", importCldr("cldr-keyboards-43.0/keyboards/windows/th-t-k0-windows.xml")],
  ["th_th_man", importKeymap("layouts/th_manoonchai.json")],
  ["th_th_pat", importCldr("cldr-keyboards-43.0/keyboards/windows/th-t-k0-windows-patta.xml")],
  ["tr_tr_f", importCldr("cldr-keyboards-43.0/keyboards/windows/tr-t-k0-windows-legacy.xml")],
  ["tr_tr_q", importCldr("cldr-keyboards-43.0/keyboards/windows/tr-t-k0-windows.xml")],
  ["uk_ua", importCldr("cldr-keyboards-43.0/keyboards/windows/uk-t-k0-windows.xml")],
] as [string, CharacterDict][]) {
  writeGeneratedFile(layout, pathTo(`../keybr-keyboard/lib/layout/${id}.ts`));
}

/** Removes dead keys from the given keyboard layout. */
function undead(layout: CharacterDict): CharacterDict {
  return Object.fromEntries(Object.entries(layout).map(([id, [a, b]]) => [id, [a, b]]));
}
