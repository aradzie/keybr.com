import { Enum, type EnumItem } from "@keybr/lang";
import { enumProp, itemProp, numberProp } from "@keybr/settings";

export enum PlaySounds {
  None = 1,
  ErrorsOnly = 2,
  All = 3,
}

export class SoundTheme implements EnumItem {
  static readonly DEFAULT = new SoundTheme("default", "Default");
  static readonly MECHANICAL1 = new SoundTheme("mechanical1", "Mechanical");
  static readonly TYPEWRITER1 = new SoundTheme("typewriter1", "Typewriter");

  static readonly ALL = new Enum<SoundTheme>(
    SoundTheme.DEFAULT,
    SoundTheme.MECHANICAL1,
    SoundTheme.TYPEWRITER1,
  );

  private constructor(
    readonly id: string,
    readonly name: string,
  ) {}

  toString() {
    return this.id;
  }

  toJSON() {
    return this.id;
  }
}

export const soundProps = {
  playSounds: enumProp("textInput.playSounds", PlaySounds, PlaySounds.None),
  soundVolume: numberProp("textInput.soundVolume", 0.5, { min: 0, max: 1 }),
  soundTheme: itemProp(
    "textInput.soundTheme",
    SoundTheme.ALL,
    SoundTheme.DEFAULT,
  ),
} as const;
