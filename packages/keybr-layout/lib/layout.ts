import { Enum, XEnum, type XEnumItem } from "@keybr/lang";
import { Geometry } from "./geometry.ts";
import { Language } from "./language.ts";

export class Layout implements XEnumItem {
  static readonly EN_US = new Layout(
    /* id= */ "en-us",
    /* xid= */ 0x10,
    /* name= */ "US",
    /* family= */ "qwerty",
    /* language= */ Language.EN,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
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
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
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
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_WORKMAN = new Layout(
    /* id= */ "en-workman",
    /* xid= */ 0x1a,
    /* name= */ "Workman",
    /* family= */ "workman",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_COLEMAK_DH = new Layout(
    /* id= */ "en-colemak-dh",
    /* xid= */ 0x1b,
    /* name= */ "Colemak-DH",
    /* family= */ "colemak-dh",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.MATRIX,
    ),
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
  static readonly EN_CANARY_MATRIX = new Layout(
    /* id= */ "en-canary-matrix",
    /* xid= */ 0x1d,
    /* name= */ "Canary (matrix)",
    /* family= */ "canary-matrix",
    /* language= */ Language.EN,
    /* emulate= */ true,
    /* geometries= */ new Enum(Geometry.MATRIX),
  );
  static readonly EN_UK = new Layout(
    /* id= */ "en-uk",
    /* xid= */ 0x11,
    /* name= */ "UK",
    /* family= */ "qwerty",
    /* language= */ Language.EN,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EN_JP = new Layout(
    /* id= */ "en-jp",
    /* xid= */ 0x12,
    /* name= */ "Japan",
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
    /* name= */ "Germany",
    /* family= */ "qwertz",
    /* language= */ Language.DE,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly DE_CH = new Layout(
    /* id= */ "de-ch",
    /* xid= */ 0x21,
    /* name= */ "Switzerland",
    /* family= */ "qwertz",
    /* language= */ Language.DE,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly DE_NEO_2 = new Layout(
    /* id= */ "de-neo-2",
    /* xid= */ 0x22,
    /* name= */ "Neo 2",
    /* family= */ "neo-2",
    /* language= */ Language.DE,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly DE_BONE = new Layout(
    /* id= */ "de-bone",
    /* xid= */ 0x23,
    /* name= */ "Bone",
    /* family= */ "bone",
    /* language= */ Language.DE,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly DE_MINE = new Layout(
    /* id= */ "de-mine",
    /* xid= */ 0x24,
    /* name= */ "Mine",
    /* family= */ "mine",
    /* language= */ Language.DE,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FR_FR = new Layout(
    /* id= */ "fr-fr",
    /* xid= */ 0x30,
    /* name= */ "France",
    /* family= */ "azerty",
    /* language= */ Language.FR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FR_CA = new Layout(
    /* id= */ "fr-ca",
    /* xid= */ 0x31,
    /* name= */ "Canada",
    /* family= */ "qwerty",
    /* language= */ Language.FR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FR_CH = new Layout(
    /* id= */ "fr-ch",
    /* xid= */ 0x32,
    /* name= */ "Switzerland",
    /* family= */ "qwertz",
    /* language= */ Language.FR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FR_BEPO = new Layout(
    /* id= */ "fr-bepo",
    /* xid= */ 0x33,
    /* name= */ "Bepo",
    /* family= */ "bepo",
    /* language= */ Language.FR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FR_ERGO_L = new Layout(
    /* id= */ "fr-ergol",
    /* xid= */ 0x34,
    /* name= */ "Ergo-L",
    /* family= */ "ergol",
    /* language= */ Language.FR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FR_OPTIMOT_ERGO = new Layout(
    /* id= */ "fr-optimot-ergo",
    /* xid= */ 0x35,
    /* name= */ "Optimot Ergo",
    /* family= */ "optimot-ergo",
    /* language= */ Language.FR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly FR_ERGLACE = new Layout(
    /* id= */ "fr-erglace",
    /* xid= */ 0x36,
    /* name= */ "Erglace",
    /* family= */ "erglace",
    /* language= */ Language.FR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly IT_IT = new Layout(
    /* id= */ "it-it",
    /* xid= */ 0x40,
    /* name= */ "Italy",
    /* family= */ "qwerty",
    /* language= */ Language.IT,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly ES_ES = new Layout(
    /* id= */ "es-es",
    /* xid= */ 0x50,
    /* name= */ "Spain",
    /* family= */ "qwerty",
    /* language= */ Language.ES,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly PL_PL = new Layout(
    /* id= */ "pl-pl",
    /* xid= */ 0x58,
    /* name= */ "Poland",
    /* family= */ "qwerty",
    /* language= */ Language.PL,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly PT_BR = new Layout(
    /* id= */ "pt-br",
    /* xid= */ 0x60,
    /* name= */ "Brazil (ABNT2)",
    /* family= */ "qwerty",
    /* language= */ Language.PT,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.BRAZILIAN_104,
      Geometry.BRAZILIAN_104_FULL,
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly PT_PT = new Layout(
    /* id= */ "pt-pt",
    /* xid= */ 0x62,
    /* name= */ "Portugal",
    /* family= */ "qwerty",
    /* language= */ Language.PT,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly RU_RU = new Layout(
    /* id= */ "ru-ru",
    /* xid= */ 0x70,
    /* name= */ "Russia",
    /* family= */ "йцукен",
    /* language= */ Language.RU,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly BE_BY = new Layout(
    /* id= */ "be-by",
    /* xid= */ 0x74,
    /* name= */ "Belarus",
    /* family= */ "йцукен",
    /* language= */ Language.BE,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly UK_UA = new Layout(
    /* id= */ "uk-ua",
    /* xid= */ 0x78,
    /* name= */ "Ukraine",
    /* family= */ "йцукен",
    /* language= */ Language.UK,
    /* emulate= */ true,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly SV_SE = new Layout(
    /* id= */ "sv-se",
    /* xid= */ 0x80,
    /* name= */ "Sweden",
    /* family= */ "qwerty",
    /* language= */ Language.SV,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly CS_CZ = new Layout(
    /* id= */ "cs-cz",
    /* xid= */ 0x81,
    /* name= */ "Czechia",
    /* family= */ "qwertz",
    /* language= */ Language.CS,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly SL_SI = new Layout(
    /* id= */ "sl-si",
    /* xid= */ 0x82,
    /* name= */ "Slovenia",
    /* family= */ "qwertz",
    /* language= */ Language.SL,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly EL_GR = new Layout(
    /* id= */ "el-gr",
    /* xid= */ 0x83,
    /* name= */ "Greek",
    /* family= */ "greek",
    /* language= */ Language.EL,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly HE_IL = new Layout(
    /* id= */ "he-il",
    /* xid= */ 0x84,
    /* name= */ "Hebrew",
    /* family= */ "hebrew",
    /* language= */ Language.HE,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly NL_NL = new Layout(
    /* id= */ "nl-nl",
    /* xid= */ 0x85,
    /* name= */ "Netherlands",
    /* family= */ "qwerty",
    /* language= */ Language.NL,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly NL_BE = new Layout(
    /* id= */ "nl-be",
    /* xid= */ 0x86,
    /* name= */ "Belgium",
    /* family= */ "azerty",
    /* language= */ Language.NL,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.MATRIX,
    ),
  );
  static readonly HU_HU = new Layout(
    /* id= */ "hu-hu",
    /* xid= */ 0x87,
    /* name= */ "Hungary",
    /* family= */ "qwertz",
    /* language= */ Language.HU,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
  );

  static readonly ALL = new XEnum<Layout>(
    Layout.EN_US,
    Layout.EN_DVORAK,
    Layout.EN_COLEMAK,
    Layout.EN_COLEMAK_DH,
    Layout.EN_COLEMAK_DH_MATRIX,
    Layout.EN_CANARY_MATRIX,
    Layout.EN_WORKMAN,
    Layout.EN_UK,
    Layout.EN_JP,
    Layout.EL_GR,
    Layout.CS_CZ,
    Layout.DE_DE,
    Layout.DE_CH,
    Layout.DE_NEO_2,
    Layout.DE_BONE,
    Layout.DE_MINE,
    Layout.FR_FR,
    Layout.FR_CA,
    Layout.FR_CH,
    Layout.FR_BEPO,
    Layout.FR_ERGO_L,
    Layout.FR_ERGLACE,
    Layout.FR_OPTIMOT_ERGO,
    Layout.HE_IL,
    Layout.HU_HU,
    Layout.IT_IT,
    Layout.NL_NL,
    Layout.NL_BE,
    Layout.ES_ES,
    Layout.PL_PL,
    Layout.PT_BR,
    Layout.PT_PT,
    Layout.BE_BY,
    Layout.SL_SI,
    Layout.SV_SE,
    Layout.UK_UA,
    Layout.RU_RU,
  );

  private constructor(
    public readonly id: string,
    public readonly xid: number,
    public readonly name: string,
    public readonly family: string,
    public readonly language: Language,
    public readonly emulate: boolean,
    public readonly geometries: Enum<Geometry>,
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
