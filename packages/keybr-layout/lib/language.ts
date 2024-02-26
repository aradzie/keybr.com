import { Enum, type EnumItem } from "@keybr/lang";

export class Language implements EnumItem {
  static readonly BE = new Language("be", "cyrillic", "ltr");
  static readonly CS = new Language("cs", "latin", "ltr");
  static readonly DE = new Language("de", "latin", "ltr");
  static readonly EL = new Language("el", "greek", "ltr");
  static readonly EN = new Language("en", "latin", "ltr");
  static readonly ES = new Language("es", "latin", "ltr");
  static readonly FR = new Language("fr", "latin", "ltr");
  static readonly HE = new Language("he", "hebrew", "rtl");
  static readonly HU = new Language("hu", "latin", "ltr");
  static readonly IT = new Language("it", "latin", "ltr");
  static readonly NL = new Language("nl", "latin", "ltr");
  static readonly PL = new Language("pl", "latin", "ltr");
  static readonly PT = new Language("pt", "latin", "ltr");
  static readonly RU = new Language("ru", "cyrillic", "ltr");
  static readonly SL = new Language("sl", "latin", "ltr");
  static readonly SV = new Language("sv", "latin", "ltr");
  static readonly NB = new Language("nb", "latin", "ltr");
  static readonly UK = new Language("uk", "cyrillic", "ltr");

  static readonly ALL = new Enum<Language>(
    Language.BE,
    Language.CS,
    Language.DE,
    Language.EL,
    Language.EN,
    Language.ES,
    Language.FR,
    Language.HE,
    Language.HU,
    Language.IT,
    Language.NL,
    Language.PL,
    Language.PT,
    Language.RU,
    Language.SL,
    Language.SV,
    Language.UK,
    Language.NB,
  );

  private constructor(
    /** ISO 639-1 language code, https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes */
    public readonly id: string,
    /** The writing system, such as Cyrillic, Georgian, Greek, Hebrew, Latin, etc. */
    public readonly script:
      | "arabic"
      | "cyrillic"
      | "greek"
      | "hebrew"
      | "latin",
    /** The direction of the writing system, either "ltr" for left-to-right, or "rtl" for right-to-left. */
    public readonly direction: "ltr" | "rtl",
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
