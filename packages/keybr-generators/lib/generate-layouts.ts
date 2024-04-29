#!/usr/bin/env -S node -r @keybr/tsl

/**
 * This script takes keyboard layout definitions in various formats and generates
 * TypeScript files with the same layouts converted into our own internal representation.
 */

import { writeGeneratedFile } from "./layout/generate.ts";
import { importCldr } from "./layout/import-cldr.ts";
import { importKeymap } from "./layout/import-json.ts";
import { importKlc } from "./layout/import-klc.ts";
import { type KeyMap, undead } from "./layout/layout.ts";
import { pathTo } from "./root.ts";

for (const [id, keymap] of [
  ["ar_sa", importCldr("cldr-keyboards-43.0/keyboards/windows/ar-t-k0-windows.xml")],
  ["ar_sa_102", importCldr("cldr-keyboards-43.0/keyboards/windows/ar-t-k0-windows-102key.xml")],
  ["be_by", importCldr("cldr-keyboards-43.0/keyboards/windows/be-t-k0-windows.xml")],
  ["cs_cz", importCldr("cldr-keyboards-43.0/keyboards/windows/cs-t-k0-windows.xml")],
  ["de_bone", importKeymap("layouts/de_bone.json")],
  ["de_ch", importCldr("cldr-keyboards-43.0/keyboards/windows/de-CH-t-k0-windows.xml")],
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
  ["en_halmak", importKeymap("layouts/en_halmak.json")],
  ["en_norman", importKeymap("layouts/en_norman.json")],
  ["en_uk", importCldr("cldr-keyboards-43.0/keyboards/windows/en-GB-t-k0-windows.xml")],
  ["en_us", importCldr("cldr-keyboards-43.0/keyboards/windows/en-t-k0-windows.xml")],
  ["en_workman", importKeymap("layouts/en_workman.json")],
  ["en_workman_prog", importKeymap("layouts/en_workman_prog.json")],
  ["es_es", importCldr("cldr-keyboards-43.0/keyboards/windows/es-t-k0-windows.xml")],
  ["fa_ir", importCldr("cldr-keyboards-43.0/keyboards/windows/fa-t-k0-windows-extended.xml")],
  ["fa_ir_legacy", importCldr("cldr-keyboards-43.0/keyboards/windows/fa-t-k0-windows.xml")],
  ["fr_bepo", importKeymap("layouts/fr_bepo.json")],
  ["fr_ca", importCldr("cldr-keyboards-43.0/keyboards/windows/fr-CA-t-k0-windows-var.xml")],
  ["fr_ch", importCldr("cldr-keyboards-43.0/keyboards/windows/fr-CH-t-k0-windows.xml")],
  ["fr_erglace", importKeymap("layouts/fr_erglace.json")],
  ["fr_ergo_l", importKeymap("layouts/fr_ergo_l.json")],
  ["fr_fr", importCldr("cldr-keyboards-43.0/keyboards/windows/fr-t-k0-windows.xml")],
  ["fr_optimot_ergo", importKeymap("layouts/fr_optimot_ergo.json")],
  ["he_il", importCldr("layouts/he_il.xml")],
  ["he_il_arkn", importCldr("layouts/he_il_arkn.xml")],
  ["hu_hu", importCldr("cldr-keyboards-43.0/keyboards/windows/hu-t-k0-windows.xml")],
  ["it_it", importCldr("cldr-keyboards-43.0/keyboards/windows/it-t-k0-windows.xml")],
  ["ja_jp_jis", importKeymap("layouts/ja_jp_jis.json")],
  ["nb_no", importCldr("cldr-keyboards-43.0/keyboards/windows/nb-t-k0-windows.xml")],
  ["nl_be", importCldr("cldr-keyboards-43.0/keyboards/windows/nl-BE-t-k0-windows.xml")],
  ["nl_nl", importCldr("cldr-keyboards-43.0/keyboards/windows/nl-t-k0-windows.xml")],
  ["pl_pl", importCldr("cldr-keyboards-43.0/keyboards/windows/pl-t-k0-windows-extended.xml")],
  ["pt_br", importCldr("cldr-keyboards-43.0/keyboards/windows/pt-t-k0-windows-var.xml")],
  ["pt_pt", importCldr("cldr-keyboards-43.0/keyboards/windows/pt-PT-t-k0-windows.xml")],
  ["ru_ru", importCldr("cldr-keyboards-43.0/keyboards/windows/ru-t-k0-windows.xml")],
  ["sl_si", importCldr("cldr-keyboards-43.0/keyboards/windows/sl-t-k0-windows.xml")],
  ["sv_se", importCldr("cldr-keyboards-43.0/keyboards/windows/sv-t-k0-windows.xml")],
  ["tr_tr_f", importCldr("cldr-keyboards-43.0/keyboards/windows/tr-t-k0-windows-legacy.xml")],
  ["tr_tr_q", importCldr("cldr-keyboards-43.0/keyboards/windows/tr-t-k0-windows.xml")],
  ["uk_ua", importCldr("cldr-keyboards-43.0/keyboards/windows/uk-t-k0-windows.xml")],
] as [string, KeyMap][]) {
  const filename = pathTo(`../keybr-keyboard/lib/layout/${id}.ts`);
  console.log(id, filename);
  writeGeneratedFile(keymap, filename);
}
