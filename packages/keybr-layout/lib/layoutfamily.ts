import { Enum, type EnumItem } from "@keybr/lang";

export class LayoutFamily implements EnumItem {
  static readonly QWERTY = new LayoutFamily(
    /* id= */ "qwerty",
    /* script= */ "latin",
  );
  static readonly QWERTZ = new LayoutFamily(
    /* id= */ "qwertz",
    /* script= */ "latin",
  );
  static readonly AZERTY = new LayoutFamily(
    /* id= */ "azerty",
    /* script= */ "latin",
  );
  static readonly DVORAK = new LayoutFamily(
    /* id= */ "dvorak",
    /* script= */ "latin",
  );
  static readonly COLEMAK = new LayoutFamily(
    /* id= */ "colemak",
    /* script= */ "latin",
  );
  static readonly COLEMAK_DH = new LayoutFamily(
    /* id= */ "colemak-dh",
    /* script= */ "latin",
  );
  static readonly COLEMAK_DH_MATRIX = new LayoutFamily(
    /* id= */ "colemak-dh-matrix",
    /* script= */ "latin",
  );
  static readonly WORKMAN = new LayoutFamily(
    /* id= */ "workman",
    /* script= */ "latin",
  );
  static readonly BEPO = new LayoutFamily(
    /* id= */ "bepo",
    /* script= */ "latin",
  );
  static readonly ERGO_L = new LayoutFamily(
    /* id= */ "ergol",
    /* script= */ "latin",
  );
  static readonly ЙЦУКЕН = new LayoutFamily(
    /* id= */ "йцукен",
    /* script= */ "cyrillic",
  );
  static readonly CUSTOM = new LayoutFamily(
    /* id= */ "custom",
    /* script= */ "latin",
  );

  static readonly ALL = new Enum<LayoutFamily>(
    LayoutFamily.QWERTY,
    LayoutFamily.QWERTZ,
    LayoutFamily.AZERTY,
    LayoutFamily.DVORAK,
    LayoutFamily.COLEMAK,
    LayoutFamily.COLEMAK_DH,
    LayoutFamily.WORKMAN,
    LayoutFamily.BEPO,
    LayoutFamily.ЙЦУКЕН,
    // LayoutFamily.CUSTOM,
  );

  private constructor(
    readonly id: string,
    readonly script: string,
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
