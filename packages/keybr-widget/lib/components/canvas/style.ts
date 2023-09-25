import { Color } from "../../utils/color.ts";

export type ColorValue = Color | string | CanvasGradient | CanvasPattern;

export type TextStyle = {
  font?: string;
  textAlign?: "left" | "right" | "center" | "start" | "end";
  textBaseline?:
    | "top"
    | "hanging"
    | "middle"
    | "alphabetic"
    | "ideographic"
    | "bottom";
};

export type FillStyle = {
  fillStyle?: ColorValue;
  fillRule?: "nonzero" | "evenodd";
};

export type StrokeStyle = {
  strokeStyle?: ColorValue;
  lineCap?: "butt" | "round" | "square";
  lineDash?: number[];
  lineDashOffset?: number;
  lineJoin?: "bevel" | "round" | "miter";
  lineWidth?: number;
  miterLimit?: number;
};

export type GraphicsStyle = TextStyle & FillStyle & StrokeStyle;

export const toCanvasColor = (
  value: ColorValue,
): string | CanvasGradient | CanvasPattern => {
  if (value instanceof Color) {
    return String(value);
  } else {
    return value;
  }
};

export const applyStyle = (
  context: CanvasRenderingContext2D,
  {
    fillStyle,
    strokeStyle,
    lineCap,
    lineDash,
    lineDashOffset,
    lineJoin,
    lineWidth,
    miterLimit,
    font,
    textAlign,
    textBaseline,
  }: GraphicsStyle,
): void => {
  if (fillStyle != null) {
    context.fillStyle = toCanvasColor(fillStyle);
  }
  if (strokeStyle != null) {
    context.strokeStyle = toCanvasColor(strokeStyle);
  }
  if (lineCap != null) {
    context.lineCap = lineCap;
  }
  if (lineDash != null) {
    context.setLineDash(lineDash);
  }
  if (lineDashOffset != null) {
    context.lineDashOffset = lineDashOffset;
  }
  if (lineJoin != null) {
    context.lineJoin = lineJoin;
  }
  if (lineWidth != null) {
    context.lineWidth = lineWidth;
  }
  if (miterLimit != null) {
    context.miterLimit = miterLimit;
  }
  if (font != null) {
    context.font = font;
  }
  if (textAlign != null) {
    context.textAlign = textAlign;
  }
  if (textBaseline != null) {
    context.textBaseline = textBaseline;
  }
};
