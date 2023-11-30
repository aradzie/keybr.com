import { Enum, type EnumItem } from "@keybr/lang";

export class Language implements EnumItem {
  static readonly BE = new Language("be", "cyrillic");
  static readonly CS = new Language("cs", "latin");
  static readonly DE = new Language("de", "latin");
  static readonly EN = new Language("en", "latin");
  static readonly ES = new Language("es", "latin");
  static readonly FR = new Language("fr", "latin");
  static readonly IT = new Language("it", "latin");
  static readonly PL = new Language("pl", "latin");
  static readonly PT = new Language("pt", "latin");
  static readonly RU = new Language("ru", "cyrillic");
  static readonly SL = new Language("sl", "latin");
  static readonly SV = new Language("sv", "latin");
  static readonly UK = new Language("uk", "cyrillic");

  static readonly ALL = new Enum<Language>(
    Language.BE,
    Language.CS,
    Language.DE,
    Language.EN,
    Language.ES,
    Language.FR,
    Language.IT,
    Language.PL,
    Language.PT,
    Language.RU,
    Language.SL,
    Language.SV,
    Language.UK,
  );

  private constructor(
    /** ISO 639-1 language code, https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes */
    public readonly id: string,
    /** Writing system, such as Cyrillic, Georgian, Greek, Latin, etc. */
    public readonly script: string,
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
