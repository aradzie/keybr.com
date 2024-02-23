import { parseCldr } from "./cldr.ts";
import { writeGeneratedFile } from "./generate.ts";
import { type LayoutConfig } from "./layout.ts";
import { LAYOUT_DE_BONE } from "./layout/layout_de_bone.ts";
import { LAYOUT_DE_MINE } from "./layout/layout_de_mine.ts";
import { LAYOUT_DE_NEO_2 } from "./layout/layout_de_neo_2.ts";
import { LAYOUT_EN_CUSTOM } from "./layout/layout_en_custom.ts";
import { LAYOUT_EN_US_CANARY_MATRIX } from "./layout/layout_en_us_canary_matrix.ts";
import { LAYOUT_EN_US_COLEMAK } from "./layout/layout_en_us_colemak.ts";
import { LAYOUT_EN_US_COLEMAK_DH } from "./layout/layout_en_us_colemak_dh.ts";
import { LAYOUT_EN_US_COLEMAK_DH_MATRIX } from "./layout/layout_en_us_colemak_dh_matrix.ts";
import { LAYOUT_EN_US_WORKMAN } from "./layout/layout_en_us_workman.ts";
import { LAYOUT_FR_BEPO } from "./layout/layout_fr_bepo.ts";
import { LAYOUT_FR_ERGO_L } from "./layout/layout_fr_ergol.ts";
import { LAYOUT_FR_OPTIMOT_ERGO } from "./layout/layout_fr_optimot_ergo.ts";
import { LAYOUT_JA_JP_JIS } from "./layout/layout_ja_jp_jis.ts";
import { readXml } from "./xml.ts";

const files: readonly [input: string | LayoutConfig, output: string][] = [
  [
    "cldr-keyboards-43.0/keyboards/windows/be-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/be_by-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/cs-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/cs_cz-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/de-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/de_de-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/de-CH-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/de_ch-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/el-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/el_gr-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/en-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/en_us-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/en-t-k0-windows-dvorak.xml",
    "../keybr-keyboard/lib/data/layout/en_us_dvorak-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/en-GB-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/en_uk-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/es-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/es_es-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/fr-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/fr_fr-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/fr-CA-t-k0-windows-var.xml",
    "../keybr-keyboard/lib/data/layout/fr_ca-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/fr-CH-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/fr_ch-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/he-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/he_il-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/it-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/it_it-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/pl-t-k0-windows-extended.xml",
    "../keybr-keyboard/lib/data/layout/pl_pl-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/pt-t-k0-windows-var.xml",
    "../keybr-keyboard/lib/data/layout/pt_br-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/pt-PT-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/pt_pt-win.ts",
  ],

  [
    "cldr-keyboards-43.0/keyboards/windows/ru-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/ru_ru-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/sl-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/sl_si-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/sv-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/sv_se-win.ts",
  ],
  [
    "cldr-keyboards-43.0/keyboards/windows/uk-t-k0-windows.xml",
    "../keybr-keyboard/lib/data/layout/uk_ua-win.ts",
  ],
  [LAYOUT_EN_US_COLEMAK, "../keybr-keyboard/lib/data/layout/en_us_colemak.ts"],
  [
    LAYOUT_EN_US_COLEMAK_DH,
    "../keybr-keyboard/lib/data/layout/en_us_colemak_dh.ts",
  ],
  [
    LAYOUT_EN_US_COLEMAK_DH_MATRIX,
    "../keybr-keyboard/lib/data/layout/en_us_colemak_dh_matrix.ts",
  ],
  [
    LAYOUT_EN_US_CANARY_MATRIX,
    "../keybr-keyboard/lib/data/layout/en_us_canary_matrix.ts",
  ],
  [LAYOUT_EN_US_WORKMAN, "../keybr-keyboard/lib/data/layout/en_us_workman.ts"],
  [LAYOUT_FR_BEPO, "../keybr-keyboard/lib/data/layout/fr_bepo.ts"],
  [LAYOUT_FR_ERGO_L, "../keybr-keyboard/lib/data/layout/fr_ergol.ts"],
  [
    LAYOUT_FR_OPTIMOT_ERGO,
    "../keybr-keyboard/lib/data/layout/fr_optimot_ergo.ts",
  ],
  [LAYOUT_DE_NEO_2, "../keybr-keyboard/lib/data/layout/de_neo_2.ts"],
  [LAYOUT_DE_BONE, "../keybr-keyboard/lib/data/layout/de_bone.ts"],
  [LAYOUT_DE_MINE, "../keybr-keyboard/lib/data/layout/de_mine.ts"],
  [
    LAYOUT_FR_OPTIMOT_ERGO,
    "../keybr-keyboard/lib/data/layout/fr_optimot_ergo.ts",
  ],
  [LAYOUT_EN_CUSTOM, "../keybr-keyboard/lib/data/layout/en_custom.ts"],
  [LAYOUT_JA_JP_JIS, "../keybr-keyboard/lib/data/layout/ja_jp_jis.ts"],
];

for (const [input, output] of files) {
  console.log(output);
  if (typeof input === "string") {
    writeGeneratedFile(parseCldr(readXml(input)), output);
  } else {
    writeGeneratedFile(input, output);
  }
}
