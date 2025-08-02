import { Enum, XEnum, type XEnumItem } from "@keybr/lang";
import { Geometry } from "./geometry.ts";
import { Language } from "./language.ts";
import { angleMod, angleWideMod, type Mod, nullMod } from "./mod.ts";

export class Layout implements XEnumItem {
  static custom(language: Language) {
    return new Layout(
      /* id= */ "custom",
      /* xid= */ 0xff,
      /* name= */ "Custom",
      /* family= */ "custom",
      /* language= */ language,
      /* emulate= */ true,
      /* geometries= */ Geometry.ALL,
    );
  }

  static readonly EN_US = new Layout(
    /* id= */ "en-us",
    /* xid= */ 0x10,
    /* name= */ "{US}",
    /* family= */ "qwerty",
    /* language= */ Language.EN,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_DVORAK = new Layout(
    /* id= */ "en-dvorak",
    /* xid= */ 0x18,
    /* name= */ "Dvorak",
    /* family= */ "dvorak",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_DVORAK_PROG = new Layout(
    /* id= */ "en-dvorak-prog",
    /* xid= */ 0x15,
    /* name= */ "Dvorak (Programmers)",
    /* family= */ "dvorak",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_COLEMAK = new Layout(
    /* id= */ "en-colemak",
    /* xid= */ 0x19,
    /* name= */ "Colemak",
    /* family= */ "colemak",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_COLEMAK_DH_ANSI = new Layout(
    /* id= */ "en-colemak-dh",
    /* xid= */ 0x1b,
    /* name= */ "Colemak-DH (ANSI)",
    /* family= */ "colemak-dh",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
    /* mod= */ angleMod,
  );
  static readonly EN_COLEMAK_DH_ANSI_WIDE = new Layout(
    /* id= */ "en-colemak-dh-wide",
    /* xid= */ 0x1f,
    /* name= */ "Colemak-DH Wide (ANSI)",
    /* family= */ "colemak-dh-wide",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
    /* mod= */ angleWideMod,
  );
  static readonly EN_COLEMAK_DH_ISO = new Layout(
    /* id= */ "en-colemak-dh-iso",
    /* xid= */ 0x16,
    /* name= */ "Colemak-DH (ISO)",
    /* family= */ "colemak-dh-iso",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
    /* mod= */ angleMod,
  );
  static readonly EN_COLEMAK_DH_ISO_WIDE = new Layout(
    /* id= */ "en-colemak-dh-iso-wide",
    /* xid= */ 0x17,
    /* name= */ "Colemak-DH Wide (ISO)",
    /* family= */ "colemak-dh-iso-wide",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
    /* mod= */ angleWideMod,
  );
  static readonly EN_COLEMAK_DH_MATRIX = new Layout(
    /* id= */ "en-colemak-dh-matrix",
    /* xid= */ 0x1c,
    /* name= */ "Colemak-DH (matrix)",
    /* family= */ "colemak-dh-matrix",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(Geometry.MATRIX),
  );
  static readonly EN_WORKMAN = new Layout(
    /* id= */ "en-workman",
    /* xid= */ 0x1a,
    /* name= */ "Workman",
    /* family= */ "workman",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_UK = new Layout(
    /* id= */ "en-uk",
    /* xid= */ 0x11,
    /* name= */ "{UK}",
    /* family= */ "qwerty",
    /* language= */ Language.EN,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_JP = new Layout(
    /* id= */ "en-jp",
    /* xid= */ 0x12,
    /* name= */ "{JP}",
    /* family= */ "qwerty",
    /* language= */ Language.EN,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.JAPANESE_106,
      Geometry.JAPANESE_106_FULL,
    ),
  );
  static readonly DE_DE = new Layout(
    /* id= */ "de-de",
    /* xid= */ 0x20,
    /* name= */ "{DE}",
    /* family= */ "qwertz",
    /* language= */ Language.DE,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly DE_CH = new Layout(
    /* id= */ "de-ch",
    /* xid= */ 0x21,
    /* name= */ "{CH}",
    /* family= */ "qwertz",
    /* language= */ Language.DE,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly DE_NEO_2 = new Layout(
    /* id= */ "de-neo-2",
    /* xid= */ 0x22,
    /* name= */ "Neo 2",
    /* family= */ "de-neo-2",
    /* language= */ Language.DE,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly DE_BONE = new Layout(
    /* id= */ "de-bone",
    /* xid= */ 0x23,
    /* name= */ "Bone",
    /* family= */ "de-bone",
    /* language= */ Language.DE,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly DE_MINE = new Layout(
    /* id= */ "de-mine",
    /* xid= */ 0x24,
    /* name= */ "Mine",
    /* family= */ "de-mine",
    /* language= */ Language.DE,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly DE_NOTED = new Layout(
    /* id= */ "de-noted",
    /* xid= */ 0x25,
    /* name= */ "Noted",
    /* family= */ "de-noted",
    /* language= */ Language.DE,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly DE_CMOS = new Layout(
    /* id= */ "de-cmos",
    /* xid= */ 0x26,
    /* name= */ "CMOS",
    /* family= */ "de-cmos",
    /* language= */ Language.DE,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FR_FR = new Layout(
    /* id= */ "fr-fr",
    /* xid= */ 0x30,
    /* name= */ "{FR}",
    /* family= */ "azerty",
    /* language= */ Language.FR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FR_CA = new Layout(
    /* id= */ "fr-ca",
    /* xid= */ 0x31,
    /* name= */ "{CA}",
    /* family= */ "qwerty",
    /* language= */ Language.FR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FR_CH = new Layout(
    /* id= */ "fr-ch",
    /* xid= */ 0x32,
    /* name= */ "{CH}",
    /* family= */ "qwertz",
    /* language= */ Language.FR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FR_BEPO = new Layout(
    /* id= */ "fr-bepo",
    /* xid= */ 0x33,
    /* name= */ "Bepo",
    /* family= */ "fr-bepo",
    /* language= */ Language.FR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FR_ERGO_L = new Layout(
    /* id= */ "fr-ergol",
    /* xid= */ 0x34,
    /* name= */ "Ergo-L",
    /* family= */ "fr-ergol",
    /* language= */ Language.FR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FR_OPTIMOT_ERGO = new Layout(
    /* id= */ "fr-optimot-ergo",
    /* xid= */ 0x35,
    /* name= */ "Optimot Ergo",
    /* family= */ "fr-optimot-ergo",
    /* language= */ Language.FR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FR_ERGLACE = new Layout(
    /* id= */ "fr-erglace",
    /* xid= */ 0x36,
    /* name= */ "Erglace",
    /* family= */ "fr-erglace",
    /* language= */ Language.FR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FR_ERGOPTI = new Layout(
    /* id= */ "fr-ergopti",
    /* xid= */ 0x37,
    /* name= */ "Ergopti",
    /* family= */ "fr-ergopti",
    /* language= */ Language.FR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly IT_IT = new Layout(
    /* id= */ "it-it",
    /* xid= */ 0x40,
    /* name= */ "{IT}",
    /* family= */ "qwerty",
    /* language= */ Language.IT,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly LT_LT = new Layout(
    /* id= */ "lt-lt",
    /* xid= */ 0x48,
    /* name= */ "{LT}",
    /* family= */ "lt-lt",
    /* language= */ Language.LT,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly ES_ES = new Layout(
    /* id= */ "es-es",
    /* xid= */ 0x50,
    /* name= */ "{ES}",
    /* family= */ "qwerty",
    /* language= */ Language.ES,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly PL_PL = new Layout(
    /* id= */ "pl-pl",
    /* xid= */ 0x58,
    /* name= */ "{PL}",
    /* family= */ "qwerty",
    /* language= */ Language.PL,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly PT_BR = new Layout(
    /* id= */ "pt-br",
    /* xid= */ 0x60,
    /* name= */ "{BR} (ABNT2)",
    /* family= */ "qwerty",
    /* language= */ Language.PT,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.BRAZILIAN_104,
      Geometry.BRAZILIAN_104_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly PT_PT = new Layout(
    /* id= */ "pt-pt",
    /* xid= */ 0x62,
    /* name= */ "{PT}",
    /* family= */ "qwerty",
    /* language= */ Language.PT,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly RU_RU = new Layout(
    /* id= */ "ru-ru",
    /* xid= */ 0x70,
    /* name= */ "{RU}",
    /* family= */ "йцукен",
    /* language= */ Language.RU,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly BE_BY = new Layout(
    /* id= */ "be-by",
    /* xid= */ 0x74,
    /* name= */ "{BY}",
    /* family= */ "йцукен",
    /* language= */ Language.BE,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly UK_UA = new Layout(
    /* id= */ "uk-ua",
    /* xid= */ 0x78,
    /* name= */ "{UA}",
    /* family= */ "йцукен",
    /* language= */ Language.UK,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly SV_SE = new Layout(
    /* id= */ "sv-se",
    /* xid= */ 0x80,
    /* name= */ "{SE}",
    /* family= */ "qwerty",
    /* language= */ Language.SV,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly CS_CZ = new Layout(
    /* id= */ "cs-cz",
    /* xid= */ 0x81,
    /* name= */ "{CZ}",
    /* family= */ "qwertz",
    /* language= */ Language.CS,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly SL_SI = new Layout(
    /* id= */ "sl-si",
    /* xid= */ 0x82,
    /* name= */ "{SI}",
    /* family= */ "qwertz",
    /* language= */ Language.SL,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EL_GR = new Layout(
    /* id= */ "el-gr",
    /* xid= */ 0x83,
    /* name= */ "{GR}",
    /* family= */ "greek",
    /* language= */ Language.EL,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly NB_NO = new Layout(
    /* id= */ "nb-no",
    /* xid= */ 0x88,
    /* name= */ "{NO}",
    /* family= */ "qwerty",
    /* language= */ Language.NB,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly HE_IL = new Layout(
    /* id= */ "he-il",
    /* xid= */ 0x84,
    /* name= */ "{IL} (מסורתי)",
    /* family= */ "hebrew",
    /* language= */ Language.HE,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly NL_NL = new Layout(
    /* id= */ "nl-nl",
    /* xid= */ 0x85,
    /* name= */ "{NL}",
    /* family= */ "qwerty",
    /* language= */ Language.NL,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly NL_BE = new Layout(
    /* id= */ "nl-be",
    /* xid= */ 0x86,
    /* name= */ "{BE}",
    /* family= */ "azerty",
    /* language= */ Language.NL,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly HU_HU = new Layout(
    /* id= */ "hu-hu",
    /* xid= */ 0x87,
    /* name= */ "{HU}",
    /* family= */ "qwertz",
    /* language= */ Language.HU,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly TR_TR_Q = new Layout(
    /* id= */ "tr-tr-q",
    /* xid= */ 0x89,
    /* name= */ "{TR} Q",
    /* family= */ "qwerty",
    /* language= */ Language.TR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly TR_TR_F = new Layout(
    /* id= */ "tr-tr-f",
    /* xid= */ 0x8a,
    /* name= */ "{TR} F",
    /* family= */ "tr-tr-f",
    /* language= */ Language.TR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_CANARY = new Layout(
    /* id= */ "en-canary",
    /* xid= */ 0x1e,
    /* name= */ "Canary",
    /* family= */ "canary",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_CANARY_MATRIX = new Layout(
    /* id= */ "en-canary-matrix",
    /* xid= */ 0x1d,
    /* name= */ "Canary (matrix)",
    /* family= */ "canary-matrix",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(Geometry.MATRIX),
  );
  static readonly EN_NORMAN = new Layout(
    /* id= */ "en-norman",
    /* xid= */ 0x8b,
    /* name= */ "Norman",
    /* family= */ "norman",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_HALMAK = new Layout(
    /* id= */ "en-halmak",
    /* xid= */ 0x8c,
    /* name= */ "Halmak",
    /* family= */ "halmak",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly AR_SA = new Layout(
    /* id= */ "ar-sa",
    /* xid= */ 0x8d,
    /* name= */ "{SA} (101)",
    /* family= */ "arabic",
    /* language= */ Language.AR,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly AR_SA_102 = new Layout(
    /* id= */ "ar-sa-102",
    /* xid= */ 0x8e,
    /* name= */ "{SA} (102)",
    /* family= */ "arabic",
    /* language= */ Language.AR,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FA_IR_LEGACY = new Layout(
    /* id= */ "fa-ir-legacy",
    /* xid= */ 0x8f,
    /* name= */ "Persian Legacy «پیش فرض فارسی»",
    /* family= */ "persian",
    /* language= */ Language.FA,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly HE_IL_ARKN = new Layout(
    /* id= */ "he-il-arkn",
    /* xid= */ 0x90,
    /* name= */ "{IL} (ארקן)",
    /* family= */ "hebrew-arkn",
    /* language= */ Language.HE,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FA_IR = new Layout(
    /* id= */ "fa-ir",
    /* xid= */ 0x91,
    /* name= */ "Persian Standard «استاندارد فارسی»",
    /* family= */ "persian",
    /* language= */ Language.FA,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_ENGRAM = new Layout(
    /* id= */ "en-engram",
    /* xid= */ 0x92,
    /* name= */ "Engram",
    /* family= */ "en-engram",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_NERPS = new Layout(
    /* id= */ "en-nerps",
    /* xid= */ 0x93,
    /* name= */ "Nerps",
    /* family= */ "nerps",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_NERPS_MATRIX = new Layout(
    /* id= */ "en-nerps-matrix",
    /* xid= */ 0x94,
    /* name= */ "Nerps (matrix)",
    /* family= */ "nerps-matrix",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(Geometry.MATRIX),
  );
  static readonly EN_HANDS_DOWN_NEU = new Layout(
    /* id= */ "en-hands-down-neu",
    /* xid= */ 0x95,
    /* name= */ "Hands Down Neu",
    /* family= */ "hands-down-neu",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.MATRIX,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
    ),
  );
  static readonly EN_STURDY = new Layout(
    /* id= */ "en-sturdy",
    /* xid= */ 0x96,
    /* name= */ "Sturdy",
    /* family= */ "sturdy",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(Geometry.MATRIX),
  );
  static readonly ES_MX = new Layout(
    /* id= */ "es-mx",
    /* xid= */ 0x97,
    /* name= */ "{MX}",
    /* family= */ "qwerty",
    /* language= */ Language.ES,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly PL_FWYR = new Layout(
    /* id= */ "pl-fwyr",
    /* xid= */ 0x98,
    /* name= */ "FWYR",
    /* family= */ "fwyr",
    /* language= */ Language.PL,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_GRAPHITE = new Layout(
    /* id= */ "en-graphite",
    /* xid= */ 0x99,
    /* name= */ "Graphite",
    /* family= */ "en-graphite",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly TH_TH = new Layout(
    /* id= */ "th-th",
    /* xid= */ 0x9a,
    /* name= */ "Thai Kedmanee",
    /* family= */ "th-th",
    /* language= */ Language.TH,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly TH_PAT = new Layout(
    /* id= */ "th-th-pat",
    /* xid= */ 0x9b,
    /* name= */ "Thai Pattachote",
    /* family= */ "th-th-pat",
    /* language= */ Language.TH,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly TH_MAN = new Layout(
    /* id= */ "th-th-man",
    /* xid= */ 0x9c,
    /* name= */ "Thai Manoonchai V1",
    /* family= */ "th-th-man",
    /* language= */ Language.TH,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly NB_KVIKK = new Layout(
    /* id= */ "nb-no-kvikk",
    /* xid= */ 0x9d,
    /* name= */ "Kvikk",
    /* family= */ "kvikk",
    /* language= */ Language.NB,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly NB_SKARP = new Layout(
    /* id= */ "nb-no-skarp",
    /* xid= */ 0x9e,
    /* name= */ "Skarp",
    /* family= */ "skarp",
    /* language= */ Language.NB,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly NB_DVORAK = new Layout(
    /* id= */ "nb-no-dvorak",
    /* xid= */ 0x9f,
    /* name= */ "Dvorak",
    /* family= */ "dvorak",
    /* language= */ Language.NB,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly RO_RO = new Layout(
    /* id= */ "ro-ro",
    /* xid= */ 0xa0,
    /* name= */ "{RO}",
    /* family= */ "qwerty",
    /* language= */ Language.RO,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_GALLIUM = new Layout(
    /* id= */ "en-gallium",
    /* xid= */ 0xa1,
    /* name= */ "Gallium",
    /* family= */ "gallium",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_GALLIUM_MATRIX = new Layout(
    /* id= */ "en-gallium-matrix",
    /* xid= */ 0xa2,
    /* name= */ "Gallium (matrix)",
    /* family= */ "gallium-matrix",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(Geometry.MATRIX),
  );
  static readonly EN_HANDS_DOWN_PROMETHIUM = new Layout(
    /* id= */ "en-hands-down-promethium",
    /* xid= */ 0xa3,
    /* name= */ "Hands Down Promethium (Matrix)",
    /* family= */ "en-hands-down-promethium",
    /* language= */ Language.EN,
    /* emulate= */ false,
    /* geometries= */ new Enum(Geometry.MATRIX),
  );
  static readonly EN_APT_v3 = new Layout(
    /* id= */ "en-aptv3",
    /* xid= */ 0xa4,
    /* name= */ "APTv3",
    /* family= */ "en-aptv3",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_FOCAL = new Layout(
    /* id= */ "en_focal",
    /* xid= */ 0xa5,
    /* name= */ "Focal",
    /* family= */ "focal",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly DE_ADNW_BUT_XCV = new Layout(
    /* id= */ "de-adnw-but-xcv",
    /* xid= */ 0xa6,
    /* name= */ "AdNW BuT-XCV",
    /* family= */ "de-adnw",
    /* language= */ Language.DE,
    /* emulate= */ true,
    /* geometries= */ new Enum(Geometry.MATRIX),
  );
  static readonly DA_DK = new Layout(
    /* id= */ "da-dk",
    /* xid= */ 0xa7,
    /* name= */ "{DK}",
    /* family= */ "qwerty",
    /* language= */ Language.DA,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_ENTHIUM_V6 = new Layout(
    /* id= */ "en-enthium-v6",
    /* xid= */ 0xa8,
    /* name= */ "Enthium V6 (Matrix)",
    /* family= */ "enthium",
    /* language= */ Language.EN,
    /* emulate= */ false,
    /* geometries= */ new Enum(Geometry.MATRIX),
  );
  static readonly EN_ENTHIUM_V10 = new Layout(
    /* id= */ "en-enthium-v10",
    /* xid= */ 0xb8,
    /* name= */ "Enthium V10 (Matrix)",
    /* family= */ "enthium",
    /* language= */ Language.EN,
    /* emulate= */ false,
    /* geometries= */ new Enum(Geometry.MATRIX),
  );
  static readonly EN_NIGHT_MATRIX = new Layout(
    /* id= */ "en-night-matrix",
    /* xid= */ 0xa9,
    /* name= */ "Night (matrix)",
    /* family= */ "night",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(Geometry.MATRIX),
  );
  static readonly EN_MTGAP = new Layout(
    /* id= */ "en-mtgap",
    /* xid= */ 0xaa,
    /* name= */ "MTGAP",
    /* family= */ "MTGAP",
    /* language= */ Language.EN,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.MATRIX,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
    ),
  );
  static readonly ES_DVORAK = new Layout(
    /* id= */ "es-dvorak",
    /* xid= */ 0xab,
    /* name= */ "Dvorak",
    /* family= */ "dvorak",
    /* language= */ Language.ES,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly ES_LATAM_DVORAK = new Layout(
    /* id= */ "es-latam-dvorak",
    /* xid= */ 0xac,
    /* name= */ "Dvorak (Latin American)",
    /* family= */ "dvorak",
    /* language= */ Language.ES,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.ISO_102,
      Geometry.ISO_102_FULL,
      Geometry.ANSI_101,
      Geometry.ANSI_101_FULL,
      Geometry.MATRIX,
    ),
  );

  static readonly ALL = new XEnum<Layout>(
    Layout.EN_US,
    Layout.EN_DVORAK,
    Layout.EN_DVORAK_PROG,
    Layout.EN_COLEMAK,
    Layout.EN_COLEMAK_DH_ANSI,
    Layout.EN_COLEMAK_DH_ANSI_WIDE,
    Layout.EN_COLEMAK_DH_ISO,
    Layout.EN_COLEMAK_DH_ISO_WIDE,
    Layout.EN_COLEMAK_DH_MATRIX,
    Layout.EN_WORKMAN,
    Layout.EN_CANARY,
    Layout.EN_CANARY_MATRIX,
    Layout.EN_NERPS,
    Layout.EN_NERPS_MATRIX,
    Layout.EN_NIGHT_MATRIX,
    Layout.EN_HANDS_DOWN_NEU,
    Layout.EN_HANDS_DOWN_PROMETHIUM,
    Layout.EN_STURDY,
    Layout.EN_NORMAN,
    Layout.EN_HALMAK,
    Layout.EN_ENGRAM,
    Layout.EN_GALLIUM,
    Layout.EN_GALLIUM_MATRIX,
    Layout.EN_GRAPHITE,
    Layout.EN_APT_v3,
    Layout.EN_FOCAL,
    Layout.EN_ENTHIUM_V6,
    Layout.EN_ENTHIUM_V10,
    Layout.EN_UK,
    Layout.EN_JP,
	Layout.EN_MTGAP,
    Layout.EL_GR,
    Layout.CS_CZ,
    Layout.DA_DK,
    Layout.DE_DE,
    Layout.DE_CH,
    Layout.DE_NEO_2,
    Layout.DE_BONE,
    Layout.DE_MINE,
    Layout.DE_NOTED,
    Layout.DE_CMOS,
    Layout.DE_ADNW_BUT_XCV,
    Layout.FR_FR,
    Layout.FR_CA,
    Layout.FR_CH,
    Layout.FR_BEPO,
    Layout.FR_ERGO_L,
    Layout.FR_ERGOPTI,
    Layout.FR_ERGLACE,
    Layout.FR_OPTIMOT_ERGO,
    Layout.HE_IL,
    Layout.HE_IL_ARKN,
    Layout.HU_HU,
    Layout.IT_IT,
    Layout.LT_LT,
    Layout.NB_NO,
    Layout.NB_DVORAK,
    Layout.NB_KVIKK,
    Layout.NB_SKARP,
    Layout.NL_NL,
    Layout.NL_BE,
    Layout.ES_ES,
    Layout.ES_MX,
    Layout.ES_DVORAK,
    Layout.ES_LATAM_DVORAK,
    Layout.PL_PL,
    Layout.PL_FWYR,
    Layout.PT_BR,
    Layout.PT_PT,
    Layout.BE_BY,
    Layout.SL_SI,
    Layout.SV_SE,
    Layout.UK_UA,
    Layout.RU_RU,
    Layout.TR_TR_Q,
    Layout.TR_TR_F,
    Layout.AR_SA,
    Layout.AR_SA_102,
    Layout.FA_IR,
    Layout.FA_IR_LEGACY,
    Layout.TH_TH,
    Layout.TH_PAT,
    Layout.TH_MAN,
    Layout.RO_RO,
  );

  static findLayout(localeId: string): Layout | null {
    const { language = null, region = null } = (() => {
      try {
        return new Intl.Locale(localeId);
      } catch {
        return {} as Intl.Locale;
      }
    })();
    if (language != null && region != null) {
      const id = `${language}-${region}`.toLowerCase();
      for (const layout of Layout.ALL) {
        if (layout.id === id) {
          return layout;
        }
      }
    }
    if (language != null) {
      const id = `${language}-`.toLowerCase();
      for (const layout of Layout.ALL) {
        if (layout.id.startsWith(id)) {
          return layout;
        }
      }
    }
    return null;
  }

  static selectableLayouts(language: Language): Layout[] {
    const list = Layout.ALL.filter(
      (layout) => layout.language.script === language.script,
    );
    return [
      ...list.filter((layout) => layout.language.id === language.id),
      ...list.filter((layout) => layout.language.id !== language.id),
    ];
  }

  static selectLayout(language: Language): Layout {
    const [layout] = Layout.selectableLayouts(language);
    if (layout == null) {
      throw new Error(); // Unreachable.
    }
    return layout;
  }

  private constructor(
    readonly id: string,
    readonly xid: number,
    readonly name: string,
    readonly family: string,
    readonly language: Language,
    readonly emulate: boolean,
    readonly geometries: Enum<Geometry>,
    readonly mod: Mod = nullMod,
  ) {
    Object.freeze(this);
  }

  toString() {
    return this.id;
  }

  toJSON() {
    return this.id;
  }
}
