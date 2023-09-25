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
  None = 0,
  Bar = 1,
  Bullet = 2,
}

export const textDisplaySettings: TextDisplaySettings = {
  caretShapeStyle: CaretShapeStyle.Underline,
  caretMovementStyle: CaretMovementStyle.Smooth,
  whitespaceStyle: WhitespaceStyle.Bullet,
  sounds: false,
};
