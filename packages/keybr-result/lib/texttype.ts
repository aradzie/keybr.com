import { XEnum, type XEnumItem } from "@keybr/lang";

export class TextType implements XEnumItem {
  static readonly GENERATED = new TextType("generated", 1);
  static readonly NATURAL = new TextType("natural", 2);
  static readonly NUMBERS = new TextType("numbers", 3);
  static readonly CODE = new TextType("code", 4);
  static readonly ALL = new XEnum<TextType>(
    TextType.GENERATED,
    TextType.NATURAL,
    TextType.NUMBERS,
    TextType.CODE,
  );

  private constructor(
    readonly id: string,
    readonly xid: number,
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
