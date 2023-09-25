import {
  applyStyle,
  type ColorValue,
  type FillStyle,
  type GraphicsStyle,
  type StrokeStyle,
  type TextStyle,
  toCanvasColor,
} from "./style.ts";

export type Shape = (g: Graphics) => void;

export type ShapeList = null | false | Shape | readonly ShapeList[];

export class Graphics {
  constructor(readonly context: CanvasRenderingContext2D) {}

  set fillStyle(value: ColorValue) {
    this.context.fillStyle = toCanvasColor(value);
  }

  set strokeStyle(value: ColorValue) {
    this.context.strokeStyle = toCanvasColor(value);
  }

  set style(style: GraphicsStyle) {
    const { context } = this;
    applyStyle(context, style);
  }

  withStyle(style: GraphicsStyle, fn: () => void): void {
    const { context } = this;
    context.save();
    applyStyle(context, style);
    fn();
    context.restore();
  }

  clear(x: number, y: number, w: number, h: number): void {
    const { context } = this;
    context.clearRect(x, y, w, h);
  }

  fillText(text: unknown, x: number, y: number): void {
    const { context } = this;
    context.beginPath();
    context.fillText(String(text), x, y);
  }

  strokeText(text: unknown, x: number, y: number): void {
    const { context } = this;
    context.beginPath();
    context.strokeText(String(text), x, y);
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    const { context } = this;
    context.beginPath();
    context.fillRect(x, y, w, h);
  }

  strokeRect(x: number, y: number, w: number, h: number): void {
    const { context } = this;
    context.beginPath();
    context.strokeRect(x, y, w, h);
  }

  fillCircle(cx: number, cy: number, r: number): void {
    const { context } = this;
    context.beginPath();
    context.arc(cx, cy, r, 0, Math.PI * 2);
    context.fill();
  }

  strokeCircle(cx: number, cy: number, r: number): void {
    const { context } = this;
    context.beginPath();
    context.arc(cx, cy, r, 0, Math.PI * 2);
    context.stroke();
  }

  strokeLine(x1: number, y1: number, x2: number, y2: number): void {
    const { context } = this;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  paint(...shapes: readonly ShapeList[]): void {
    paintShapes(this, ...shapes);
  }
}

export class Shapes {
  static clear(): Shape {
    return (g: Graphics): void => {
      const { width, height } = g.context.canvas;
      g.clear(0, 0, width, height);
    };
  }

  static fill(style: FillStyle, ...shapes: readonly ShapeList[]): Shape {
    return (g: Graphics): void => {
      const { context } = g;
      g.withStyle(style, () => {
        context.beginPath();
        paintShapes(g, shapes);
        context.fill();
      });
    };
  }

  static stroke(style: StrokeStyle, ...shapes: readonly ShapeList[]): Shape {
    return (g: Graphics): void => {
      const { context } = g;
      g.withStyle(style, () => {
        context.beginPath();
        paintShapes(g, shapes);
        context.stroke();
      });
    };
  }

  static line({
    x1,
    y1,
    x2,
    y2,
  }: {
    readonly x1: number;
    readonly y1: number;
    readonly x2: number;
    readonly y2: number;
  }): Shape {
    return (g: Graphics): void => {
      const { context } = g;
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
    };
  }

  static rect({
    x,
    y,
    width,
    height,
  }: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  }): Shape {
    return (g: Graphics): void => {
      const { context } = g;
      context.rect(x, y, width, height);
    };
  }

  static circle({
    cx,
    cy,
    r,
  }: {
    readonly cx: number;
    readonly cy: number;
    readonly r: number;
  }): Shape {
    return (g: Graphics): void => {
      const { context } = g;
      context.arc(cx, cy, r, 0, Math.PI * 2);
    };
  }

  static fillText({
    value,
    x,
    y,
    style = {},
  }: {
    readonly value: unknown;
    readonly x: number;
    readonly y: number;
    readonly style: TextStyle & FillStyle;
  }): Shape {
    return (g: Graphics): void => {
      g.withStyle(style, () => {
        g.fillText(value, x, y);
      });
    };
  }

  static strokeText({
    value,
    x,
    y,
    style = {},
  }: {
    readonly value: unknown;
    readonly x: number;
    readonly y: number;
    readonly style: TextStyle & StrokeStyle;
  }): Shape {
    return (g: Graphics): void => {
      g.withStyle(style, () => {
        g.strokeText(value, x, y);
      });
    };
  }
}

function paintShapes(g: Graphics, ...shapes: readonly ShapeList[]): void {
  for (const item of shapes) {
    if (item == null || item === false) {
      continue;
    }
    if (typeof item === "object" && Array.isArray(item)) {
      paintShapes(g, ...item);
      continue;
    }
    if (typeof item === "function") {
      item(g);
      continue;
    }
    throw new TypeError();
  }
}
