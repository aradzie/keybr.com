import { CaretShapeStyle, TapeModeStyle } from "@keybr/textinput";

export type TextDirection = "ltr" | "rtl";

/**
 * Left position of the cursor, measured from the left edge of the char box at x.
 */
export function computeCaretLeft(
  shape: CaretShapeStyle,
  direction: TextDirection,
  x: number,
  w: number,
): number {
  switch (shape) {
    case CaretShapeStyle.Block:
    case CaretShapeStyle.Underline:
      return x;
    case CaretShapeStyle.Box:
      return x - 2;
    case CaretShapeStyle.Line:
      return direction === "rtl" ? x + w : x - 2;
  }
}

export type TapeScrollParams = {
  readonly tapeModeStyle: TapeModeStyle;
  readonly charX: number;
  readonly charWidth: number;
  readonly wordX: number;
  readonly wordWidth: number;
  readonly containerWidth: number;
};

/**
 * How far the text must scroll to bring the cursor target to the middle
 * of the container. In letter mode the target is the character, in word
 * mode the middle of the current word.
 */
export function computeTapeScroll({
  tapeModeStyle,
  charX,
  charWidth,
  wordX,
  wordWidth,
  containerWidth,
}: TapeScrollParams): number {
  const center = containerWidth / 2;
  switch (tapeModeStyle) {
    case TapeModeStyle.Letter:
      return charX + charWidth / 2 - center;
    case TapeModeStyle.Word:
      return wordX + wordWidth / 2 - center;
    default:
      return 0;
  }
}
