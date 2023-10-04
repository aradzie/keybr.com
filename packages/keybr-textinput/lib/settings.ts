import { booleanProp, enumProp, type Settings } from "@keybr/settings";

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
};

export const textInputSettings: TextInputSettings = {
  stopOnError: true,
  forgiveErrors: true,
};

export const textInputProps = {
  stopOnError: booleanProp("textInput.stopOnError", true),
  forgiveErrors: booleanProp("textInput.forgiveErrors", true),
} as const;

export function toTextInputSettings(settings: Settings): TextInputSettings {
  return {
    stopOnError: settings.get(textInputProps.stopOnError),
    forgiveErrors: settings.get(textInputProps.forgiveErrors),
  };
}

export type TextDisplaySettings = {
  readonly caretShapeStyle: CaretShapeStyle;
  readonly caretMovementStyle: CaretMovementStyle;
  readonly whitespaceStyle: WhitespaceStyle;
  readonly sounds: boolean;
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

export const textDisplaySettings: TextDisplaySettings = {
  caretShapeStyle: CaretShapeStyle.Underline,
  caretMovementStyle: CaretMovementStyle.Smooth,
  whitespaceStyle: WhitespaceStyle.Bullet,
  sounds: false,
};

export const textDisplayProps = {
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
  sounds: booleanProp("textDisplay.sounds", false),
} as const;

export function toTextDisplaySettings(settings: Settings): TextDisplaySettings {
  return {
    caretShapeStyle: settings.get(textDisplayProps.caretShapeStyle),
    caretMovementStyle: settings.get(textDisplayProps.caretMovementStyle),
    whitespaceStyle: settings.get(textDisplayProps.whitespaceStyle),
    sounds: settings.get(textDisplayProps.sounds),
  };
}
