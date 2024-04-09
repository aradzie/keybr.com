import { Enum, type EnumItem } from "@keybr/lang";
import { type CodePoint, toCodePoints } from "@keybr/unicode";

export class Language implements EnumItem {
  static readonly BE = new Language(
    /* id= */ "be",
    /* script= */ "cyrillic",
    /* direction= */ "ltr",
    /* alphabet= */ "абвгдежзійклмнопрстуўфхцчшыьэюя",
  );
  static readonly CS = new Language(
    /* id= */ "cs",
    /* script= */ "latin",
    /* direction= */ "ltr",
    /* alphabet= */ "aábcčdďeéěfghiíjklmnňoóprřsštťuúůvxyýzž",
  );
  static readonly DE = new Language(
    /* id= */ "de",
    /* script= */ "latin",
    /* direction= */ "ltr",
    /* alphabet= */ "aäbcdefghijklmnoöpqrstuüvwxyzß",
  );
  static readonly EL = new Language(
    /* id= */ "el",
    /* script= */ "greek",
    /* direction= */ "ltr",
    /* alphabet= */ "αάβγδεέζηήθιίκλμνξοόπρσςτυύφχψωώ",
  );
  static readonly EN = new Language(
    /* id= */ "en",
    /* script= */ "latin",
    /* direction= */ "ltr",
    /* alphabet= */ "abcdefghijklmnopqrstuvwxyz",
  );
  static readonly ES = new Language(
    /* id= */ "es",
    /* script= */ "latin",
    /* direction= */ "ltr",
    /* alphabet= */ "aábcdeéfghiíjlmnñoópqrstuúüvxyz",
  );
  static readonly FR = new Language(
    /* id= */ "fr",
    /* script= */ "latin",
    /* direction= */ "ltr",
    /* alphabet= */ "abcçdeéèfghijlmnopqrstuvxyz",
  );
  static readonly HE = new Language(
    /* id= */ "he",
    /* script= */ "hebrew",
    /* direction= */ "rtl",
    /* alphabet= */ "אבגדהוזחטיכךלמםנןסעפףצץקרשת",
  );
  static readonly HU = new Language(
    /* id= */ "hu",
    /* script= */ "latin",
    /* direction= */ "ltr",
    /* alphabet= */ "aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyz",
  );
  static readonly IT = new Language(
    /* id= */ "it",
    /* script= */ "latin",
    /* direction= */ "ltr",
    /* alphabet= */ "abcdefghijklmnopqrstuvwxyz",
  );
  static readonly NB = new Language(
    /* id= */ "nb",
    /* script= */ "latin",
    /* direction= */ "ltr",
    /* alphabet= */ "abcdefghijklmnoprstuvwxyæøå",
  );
  static readonly NL = new Language(
    /* id= */ "nl",
    /* script= */ "latin",
    /* direction= */ "ltr",
    /* alphabet= */ "abcdefghijklmnopqrstuvwxyz",
  );
  static readonly PL = new Language(
    /* id= */ "pl",
    /* script= */ "latin",
    /* direction= */ "ltr",
    /* alphabet= */ "aąbcćdeęfghijklłmnńoóprsśtuwyzźż",
  );
  static readonly PT = new Language(
    /* id= */ "pt",
    /* script= */ "latin",
    /* direction= */ "ltr",
    /* alphabet= */ "aáâãàbcçdeéêfghiíjklmnoóôõpqrstuúvwxyz",
  );
  static readonly RU = new Language(
    /* id= */ "ru",
    /* script= */ "cyrillic",
    /* direction= */ "ltr",
    /* alphabet= */ "абвгдежзийклмнопрстуфхцчшщъыьэюя",
  );
  static readonly SL = new Language(
    /* id= */ "sl",
    /* script= */ "latin",
    /* direction= */ "ltr",
    /* alphabet= */ "abcčdefghijklmnoprsštuvzž",
  );
  static readonly SV = new Language(
    /* id= */ "sv",
    /* script= */ "latin",
    /* direction= */ "ltr",
    /* alphabet= */ "abcdefghijklmnoprstuvwxyåäö",
  );
  static readonly TR = new Language(
    /* id= */ "tr",
    /* script= */ "latin",
    /* direction= */ "ltr",
    /* alphabet= */ "abcçdefgğhıijklmnoöprsştuüvyz",
  );
  static readonly UK = new Language(
    /* id= */ "uk",
    /* script= */ "cyrillic",
    /* direction= */ "ltr",
    /* alphabet= */ "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя",
  );

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
    Language.NB,
    Language.NL,
    Language.PL,
    Language.PT,
    Language.RU,
    Language.SL,
    Language.SV,
    Language.TR,
    Language.UK,
  );

  /** ISO 639-1 language code, https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes */
  readonly id: string;
  /** The writing system, such as Cyrillic, Georgian, Greek, Hebrew, Latin, etc. */
  readonly script: "cyrillic" | "greek" | "hebrew" | "latin";
  /** The direction of the writing system, either "ltr" for left-to-right, or "rtl" for right-to-left. */
  readonly direction: "ltr" | "rtl";
  /** The list of alphabet code points. */
  readonly alphabet: readonly CodePoint[];
  /** The locale. */
  readonly locale: Intl.Locale;
  /** The collator for sorting strings. */
  readonly collator: Intl.Collator;
  /** A locale-sensitive string comparison function. */
  readonly compare: (a: string, b: string) => number;
  /** A locale-sensitive string uppercase function. */
  readonly upperCase: (v: string) => string;
  /** A locale-sensitive string lowercase function. */
  readonly lowerCase: (v: string) => string;
  /** A locale-sensitive string capitalize function. */
  readonly capitalCase: (v: string) => string;

  private constructor(
    id: string,
    script: "cyrillic" | "greek" | "hebrew" | "latin",
    direction: "ltr" | "rtl",
    alphabet: string,
  ) {
    const locale = new Intl.Locale(id).maximize();
    const collator = new Intl.Collator(locale);
    this.id = id;
    this.script = script;
    this.direction = direction;
    this.alphabet = Object.freeze([...toCodePoints(alphabet)]);
    this.locale = locale;
    this.collator = collator;
    this.compare = (a, b) => collator.compare(a, b);
    this.upperCase = (v) => v.toLocaleUpperCase(locale);
    this.lowerCase = (v) => v.toLocaleLowerCase(locale);
    this.capitalCase = (v) =>
      v.substring(0, 1).toLocaleUpperCase(locale) +
      v.substring(1).toLocaleLowerCase(locale);
    Object.freeze(this);
  }

  /**
   * Checks whether the given string is composed only of the language letters,
   * case-insensitive.
   */
  test = (v: string): boolean => {
    for (const codePoint of toCodePoints(this.lowerCase(v))) {
      if (!this.alphabet.includes(codePoint)) {
        return false;
      }
    }
    return true;
  };

  toString() {
    return this.id;
  }

  toJSON() {
    return this.id;
  }
}
