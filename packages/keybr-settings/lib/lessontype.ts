import { Enum, type EnumItem } from "@keybr/lang";
import { TextType } from "@keybr/result";

export class LessonType implements EnumItem {
  static readonly GUIDED = new LessonType("guided", TextType.GENERATED);
  static readonly WORDLIST = new LessonType("wordlist", TextType.NATURAL);
  static readonly CUSTOM = new LessonType("custom", TextType.NATURAL);
  static readonly NUMBERS = new LessonType("numbers", TextType.NUMBERS);
  static readonly ALL = new Enum<LessonType>(
    LessonType.GUIDED,
    LessonType.WORDLIST,
    LessonType.CUSTOM,
    LessonType.NUMBERS,
  );

  private constructor(
    readonly id: string,
    readonly textType: TextType,
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
