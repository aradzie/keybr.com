import { Language } from "@keybr/keyboard";
import { Enum, type EnumItem } from "@keybr/lang";

/**
 * A named, selectable word list for the "Word list" lesson type.
 *
 * The `keybr` variant maps to the built-in per-language frequency word list.
 * The `monkeytype` variants are imported from monkeytype.com (GPL-3, same
 * license as keybr) and stored in `@keybr/content-words`, see the
 * `data/words-en-monkeytype-*.json` files. They are English only.
 *
 * The `size` is the number of words the list contains and doubles as the upper
 * bound for the "Word list size" setting when the list is selected.
 */
export class NamedWordList implements EnumItem {
  static readonly EN_KEYBR = new NamedWordList(
    /* id= */ "en-keybr",
    /* language= */ Language.EN,
    /* title= */ "keybr — common words",
    /* size= */ 1000,
  );
  static readonly EN_MONKEYTYPE_1K = new NamedWordList(
    /* id= */ "en-monkeytype-1k",
    /* language= */ Language.EN,
    /* title= */ "English 1K — Monkeytype",
    /* size= */ 1000,
  );
  static readonly EN_MONKEYTYPE_5K = new NamedWordList(
    /* id= */ "en-monkeytype-5k",
    /* language= */ Language.EN,
    /* title= */ "English 5K — Monkeytype",
    /* size= */ 5000,
  );
  static readonly EN_MONKEYTYPE_MISSPELLED = new NamedWordList(
    /* id= */ "en-monkeytype-misspelled",
    /* language= */ Language.EN,
    /* title= */ "English commonly misspelled — Monkeytype",
    /* size= */ 1729,
  );

  static readonly ALL = new Enum<NamedWordList>(
    NamedWordList.EN_KEYBR,
    NamedWordList.EN_MONKEYTYPE_1K,
    NamedWordList.EN_MONKEYTYPE_5K,
    NamedWordList.EN_MONKEYTYPE_MISSPELLED,
  );

  private constructor(
    readonly id: string,
    readonly language: Language,
    readonly title: string,
    readonly size: number,
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
