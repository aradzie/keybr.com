import { Enum, type EnumItem } from "@keybr/lang";

export enum Direction {
  LTR,
  RTL,
}

export class Language implements EnumItem {
  static readonly BE = new Language("be", "cyrillic", Direction.LTR);
  static readonly CS = new Language("cs", "latin", Direction.LTR);
  static readonly DE = new Language("de", "latin", Direction.LTR);
  static readonly EL = new Language("el", "greek", Direction.LTR);
  static readonly EN = new Language("en", "latin", Direction.LTR);
  static readonly ES = new Language("es", "latin", Direction.LTR);
  static readonly FR = new Language("fr", "latin", Direction.LTR);
  static readonly HE = new Language("he", "hebrew", Direction.RTL);
  static readonly IT = new Language("it", "latin", Direction.LTR);
  static readonly PL = new Language("pl", "latin", Direction.LTR);
  static readonly PT = new Language("pt", "latin", Direction.LTR);
  static readonly RU = new Language("ru", "cyrillic", Direction.LTR);
  static readonly SL = new Language("sl", "latin", Direction.LTR);
  static readonly SV = new Language("sv", "latin", Direction.LTR);
  static readonly UK = new Language("uk", "cyrillic", Direction.LTR);

  static readonly ALL = new Enum<Language>(
    Language.BE,
    Language.CS,
    Language.DE,
    Language.EL,
    Language.EN,
    Language.ES,
    Language.FR,
    Language.HE,
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

    public readonly direction: Direction,
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
