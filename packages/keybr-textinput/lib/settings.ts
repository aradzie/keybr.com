import { keyboardProps, Language } from "@keybr/keyboard";
import {
  booleanProp,
  enumProp,
  itemProp,
  numberProp,
  type Settings,
} from "@keybr/settings";
import { Font } from "./font.ts";

/**
 * Text input settings.
 */
export type TextInputSettings = {
  /**
   * If enabled then text input stops advancing until the right key
   * at the cursor position is pressed, no delete key is used.
   * If disabled all errors will be accumulated in the garbage field
   * and must be cleared with the delete key.
   */
  readonly stopOnError: boolean;
  /**
   * Enabling this option makes text input forgive some kind of errors,
   * like typing a wrong character or skipping a character.
   */
  readonly forgiveErrors: boolean;
  /**
   * If enabled then the space key skips all characters of a current word
   * to the first character of a next word.
   */
  readonly spaceSkipsWords: boolean;
};

export const textInputSettings: TextInputSettings = {
  stopOnError: true,
  forgiveErrors: true,
  spaceSkipsWords: true,
};

export const textInputProps = {
  stopOnError: booleanProp("textInput.stopOnError", true),
  forgiveErrors: booleanProp("textInput.forgiveErrors", true),
  spaceSkipsWords: booleanProp("textInput.spaceSkipsWords", false),
} as const;

export function toTextInputSettings(settings: Settings): TextInputSettings {
  return {
    stopOnError: settings.get(textInputProps.stopOnError),
    forgiveErrors: settings.get(textInputProps.forgiveErrors),
    spaceSkipsWords: settings.get(textInputProps.spaceSkipsWords),
  };
}

export type TextDisplaySettings = {
  readonly font: Font;
  readonly caretShapeStyle: CaretShapeStyle;
  readonly caretMovementStyle: CaretMovementStyle;
  readonly whitespaceStyle: WhitespaceStyle;
  readonly playSounds: PlaySounds;
  readonly soundVolume: number;
  readonly language: Language;
};

export enum CaretShapeStyle {
  Block = 1,
  Box = 2,
  Line = 3,
  Underline = 4,
}

export enum CaretMovementStyle {
  Jumping = 1,
  Smooth = 2,
}

export enum WhitespaceStyle {
  Space = 1,
  Bar = 2,
  Bullet = 3,
}

export enum PlaySounds {
  None = 1,
  ErrorsOnly = 2,
  All = 3,
}

export const textDisplaySettings: TextDisplaySettings = {
  font: Font.UBUNTU_MONO,
  caretShapeStyle: CaretShapeStyle.Underline,
  caretMovementStyle: CaretMovementStyle.Smooth,
  whitespaceStyle: WhitespaceStyle.Bullet,
  playSounds: PlaySounds.None,
  soundVolume: 0.5,
  language: Language.EN,
};

export const textDisplayProps = {
  font: itemProp("textDisplay.font", Font.ALL, Font.UBUNTU_MONO),
  caretShapeStyle: enumProp(
    "textDisplay.caretShapeStyle",
    CaretShapeStyle,
    CaretShapeStyle.Underline,
  ),
  caretMovementStyle: enumProp(
    "textDisplay.caretMovementStyle",
    CaretMovementStyle,
    CaretMovementStyle.Smooth,
  ),
  whitespaceStyle: enumProp(
    "textDisplay.whitespaceStyle",
    WhitespaceStyle,
    WhitespaceStyle.Bullet,
  ),
  playSounds: enumProp("textDisplay.playSounds", PlaySounds, PlaySounds.None),
  soundVolume: numberProp("textDisplay.soundVolume", 0.5, { min: 0, max: 1 }),
} as const;

export function toTextDisplaySettings(settings: Settings): TextDisplaySettings {
  return {
    font: settings.get(textDisplayProps.font),
    caretShapeStyle: settings.get(textDisplayProps.caretShapeStyle),
    caretMovementStyle: settings.get(textDisplayProps.caretMovementStyle),
    whitespaceStyle: settings.get(textDisplayProps.whitespaceStyle),
    playSounds: settings.get(textDisplayProps.playSounds),
    soundVolume: settings.get(textDisplayProps.soundVolume),
    language: settings.get(keyboardProps.layout).language,
  };
}
