import { XEnum, type XEnumItem } from "@keybr/lang";

export class TextType implements XEnumItem {
  static readonly GENERATED = new TextType("generated", 1);
  static readonly NATURAL = new TextType("natural", 2);
  static readonly NUMBERS = new TextType("numbers", 3);
  static readonly ALL = new XEnum<TextType>(
    TextType.GENERATED,
    TextType.NATURAL,
    TextType.NUMBERS,
  );

  private constructor(
    readonly id: string,
    readonly xid: number,
  ) {
    Object.freeze(this);
  }

  toString(): string {
    return this.id;
  }

  toJSON(): unknown {
    return this.id;
  }
}
