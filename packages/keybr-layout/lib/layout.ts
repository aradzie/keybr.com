import { type EnumItem, XEnum } from "@keybr/lang";
import { Language } from "./language.ts";
import { LayoutFamily } from "./layoutfamily.ts";

export class Layout implements EnumItem {
  static readonly EN_US = new Layout(
    /* id= */ "us",
    /* xid= */ 0x10,
    /* name= */ "US",
    /* family= */ LayoutFamily.QWERTY,
    /* language= */ Language.EN,
  );
  static readonly EN_US_DVORAK = new Layout(
    /* id= */ "us-dvorak",
    /* xid= */ 0x18,
    /* name= */ "US Dvorak",
    /* family= */ LayoutFamily.DVORAK,
    /* language= */ Language.EN,
    /* emulate= */ true,
  );
  static readonly EN_US_COLEMAK = new Layout(
    /* id= */ "us-colemak",
    /* xid= */ 0x19,
    /* name= */ "US Colemak",
    /* family= */ LayoutFamily.COLEMAK,
    /* language= */ Language.EN,
    /* emulate= */ true,
  );
  static readonly EN_US_WORKMAN = new Layout(
    /* id= */ "us-workman",
    /* xid= */ 0x1a,
    /* name= */ "US Workman",
    /* family= */ LayoutFamily.WORKMAN,
    /* language= */ Language.EN,
    /* emulate= */ true,
  );
  static readonly EN_US_COLEMAK_DH = new Layout(
    /* id= */ "us-colemak-dh",
    /* xid= */ 0x1b,
    /* name= */ "US Colemak-DH",
    /* family= */ LayoutFamily.COLEMAK_DH,
    /* language= */ Language.EN,
    /* emulate= */ true,
  );
  static readonly EN_US_COLEMAK_DH_MATRIX = new Layout(
    /* id= */ "us-colemak-dh-matrix",
    /* xid= */ 0x1c,
    /* name= */ "US Colemak-DH (matrix)",
    /* family= */ LayoutFamily.COLEMAK_DH_MATRIX,
    /* language= */ Language.EN,
    /* emulate= */ true,
  );
  static readonly EN_UK = new Layout(
    /* id= */ "uk",
    /* xid= */ 0x11,
    /* name= */ "UK",
    /* family= */ LayoutFamily.QWERTY,
    /* language= */ Language.EN,
  );
  static readonly DE_DE = new Layout(
    /* id= */ "de",
    /* xid= */ 0x20,
    /* name= */ "Germany",
    /* family= */ LayoutFamily.QWERTZ,
    /* language= */ Language.DE,
  );
  static readonly DE_CH = new Layout(
    /* id= */ "de-ch",
    /* xid= */ 0x21,
    /* name= */ "Switzerland",
    /* family= */ LayoutFamily.QWERTZ,
    /* language= */ Language.DE,
  );
  static readonly FR_FR = new Layout(
    /* id= */ "fr",
    /* xid= */ 0x30,
    /* name= */ "France",
    /* family= */ LayoutFamily.AZERTY,
    /* language= */ Language.FR,
  );
  static readonly FR_CA = new Layout(
    /* id= */ "fr-ca",
    /* xid= */ 0x31,
    /* name= */ "Canada",
    /* family= */ LayoutFamily.QWERTY,
    /* language= */ Language.FR,
  );
  static readonly FR_CH = new Layout(
    /* id= */ "fr-ch",
    /* xid= */ 0x32,
    /* name= */ "Switzerland",
    /* family= */ LayoutFamily.QWERTZ,
    /* language= */ Language.FR,
  );
  static readonly FR_BEPO = new Layout(
    /* id= */ "fr-bepo",
    /* xid= */ 0x33,
    /* name= */ "Bepo",
    /* family= */ LayoutFamily.BEPO,
    /* language= */ Language.FR,
  );
  static readonly FR_ERGO_L = new Layout(
    /* id= */ "fr-ergol",
    /* xid= */ 0x34,
    /* name= */ "Ergo-L",
    /* family= */ LayoutFamily.ERGO_L,
    /* language= */ Language.FR,
  );
  static readonly FR_OPTIMOT = new Layout(
    /* id= */ "fr-optimot",
    /* xid= */ 0x35,
    /* name= */ "Optimot",
    /* family= */ LayoutFamily.OPTIMOT,
    /* language= */ Language.FR,
  );
  static readonly IT_IT = new Layout(
    /* id= */ "it",
    /* xid= */ 0x40,
    /* name= */ "Italy",
    /* family= */ LayoutFamily.QWERTY,
    /* language= */ Language.IT,
  );
  static readonly ES_ES = new Layout(
    /* id= */ "es",
    /* xid= */ 0x50,
    /* name= */ "Spain",
    /* family= */ LayoutFamily.QWERTY,
    /* language= */ Language.ES,
  );
  static readonly PL_PL = new Layout(
    /* id= */ "pl",
    /* xid= */ 0x58,
    /* name= */ "Poland",
    /* family= */ LayoutFamily.QWERTY,
    /* language= */ Language.PL,
  );
  static readonly PT_BR = new Layout(
    /* id= */ "pt-br",
    /* xid= */ 0x60,
    /* name= */ "Brazil (ABNT2)",
    /* family= */ LayoutFamily.QWERTY,
    /* language= */ Language.PT,
  );
  static readonly PT_PT = new Layout(
    /* id= */ "pt-pt",
    /* xid= */ 0x62,
    /* name= */ "Portugal",
    /* family= */ LayoutFamily.QWERTY,
    /* language= */ Language.PT,
  );
  static readonly RU_RU = new Layout(
    /* id= */ "ru",
    /* xid= */ 0x70,
    /* name= */ "Russia",
    /* family= */ LayoutFamily.ЙЦУКЕН,
    /* language= */ Language.RU,
    /* emulate= */ true,
  );
  static readonly BE_BY = new Layout(
    /* id= */ "be",
    /* xid= */ 0x74,
    /* name= */ "Belarus",
    /* family= */ LayoutFamily.ЙЦУКЕН,
    /* language= */ Language.BE,
    /* emulate= */ true,
  );
  static readonly UK_UA = new Layout(
    /* id= */ "ua",
    /* xid= */ 0x78,
    /* name= */ "Ukraine",
    /* family= */ LayoutFamily.ЙЦУКЕН,
    /* language= */ Language.UK,
    /* emulate= */ true,
  );
  static readonly EN_CUSTOM = new Layout(
    /* id= */ "custom",
    /* xid= */ 0xff,
    /* name= */ "Custom",
    /* family= */ LayoutFamily.CUSTOM,
    /* language= */ Language.EN,
    /* emulate= */ true,
  );

  static readonly ALL = new XEnum<Layout>(
    Layout.EN_US,
    Layout.EN_US_DVORAK,
    Layout.EN_US_COLEMAK,
    Layout.EN_US_COLEMAK_DH,
    Layout.EN_US_COLEMAK_DH_MATRIX,
    Layout.EN_US_WORKMAN,
    Layout.EN_UK,
    Layout.DE_DE,
    Layout.DE_CH,
    Layout.FR_FR,
    Layout.FR_CA,
    Layout.FR_CH,
    Layout.FR_BEPO,
    Layout.FR_ERGO_L,
    Layout.FR_OPTIMOT,
    Layout.IT_IT,
    Layout.ES_ES,
    Layout.PT_BR,
    Layout.PT_PT,
    Layout.UK_UA,
    Layout.RU_RU,
    // Layout.EN_CUSTOM,
  );

  static getDefault(locale: string | null = null): Layout {
    for (const layout of Layout.ALL) {
      if (layout.language.id === locale) {
        return layout;
      }
    }
    return Layout.EN_US;
  }

  private constructor(
    public readonly id: string,
    public readonly xid: number,
    public readonly name: string,
    public readonly family: LayoutFamily,
    public readonly language: Language,
    public readonly emulate: boolean = false,
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
