import { Enum, type EnumItem } from "@keybr/lang";

export class Language implements EnumItem {
  static readonly BE = new Language("be", "cyrillic");
  static readonly DE = new Language("de", "latin");
  static readonly EN = new Language("en", "latin");
  static readonly ES = new Language("es", "latin");
  static readonly FR = new Language("fr", "latin");
  static readonly IT = new Language("it", "latin");
  static readonly PL = new Language("pl", "latin");
  static readonly PT = new Language("pt", "latin");
  static readonly RU = new Language("ru", "cyrillic");
  static readonly UK = new Language("uk", "cyrillic");

  static readonly ALL = new Enum<Language>(
    // Language.BE,
    Language.DE,
    Language.EN,
    Language.ES,
    Language.FR,
    Language.IT,
    // Language.PL,
    Language.PT,
    Language.RU,
    // Language.UK,
  );

  private constructor(
    public readonly id: string,
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
