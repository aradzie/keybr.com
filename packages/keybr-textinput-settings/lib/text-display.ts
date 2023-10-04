import { booleanProp, enumProp, type Settings } from "@keybr/settings";

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
