import { Enum, type EnumItem } from "@keybr/lang";
import { TextType } from "@keybr/result";

export class LessonType implements EnumItem {
  static readonly GUIDED = new LessonType("guided", TextType.GENERATED);
  static readonly WORDLIST = new LessonType("wordlist", TextType.NATURAL);
  static readonly CUSTOM = new LessonType("custom", TextType.NATURAL);
  static readonly NUMBERS = new LessonType("numbers", TextType.NUMBERS);
  static readonly CODE = new LessonType("code", TextType.CODE);
  static readonly ALL = new Enum<LessonType>(
    LessonType.GUIDED,
    LessonType.WORDLIST,
    LessonType.CUSTOM,
    LessonType.NUMBERS,
    LessonType.CODE,
  );

  private constructor(
    readonly id: string,
    readonly textType: TextType,
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
