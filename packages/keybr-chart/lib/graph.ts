import { type Model, type Range, type Vector } from "@keybr/math";
import {
  type Graphics,
  type GraphicsStyle,
  type Rect,
  type ShapeList,
  Shapes,
} from "@keybr/widget";
import { vBoxes } from "./geometry.ts";

export type Projection = {
  readonly box: Rect;
  readonly xmin: number;
  readonly xmax: number;
  readonly ymin: number;
  readonly ymax: number;
  readonly x: (v: number) => number;
  readonly y: (v: number) => number;
};

export function projection(box: Rect, xr: Range, yr: Range): Projection {
  const { x, y, width, height } = box;
  const xmin = xr.min;
  const xmax = xr.max;
  const ymin = yr.min;
  const ymax = yr.max;
  const dx = xmax - xmin;
  const dy = ymax - ymin;
  return {
    box,
    xmin,
    xmax,
    ymin,
    ymax,
    x: (v: number): number => x + ((v - xmin) / dx) * width,
    y: (v: number): number => y + (height - ((v - ymin) / dy) * height),
  };
}

export function paintScatterPlot(
  proj: Projection,
  dx: Vector,
  dy: Vector,
  {
    style,
  }: {
    readonly style: GraphicsStyle;
  },
): ShapeList {
  return (g: Graphics): void => {
    g.withStyle(style, () => {
      const r = Math.round(
        Math.min(Math.max(proj.box.width / dx.length, 2), 6),
      );
      for (let i = 0; i < dx.length; i++) {
        g.fillCircle(proj.x(dx.at(i)), proj.y(dy.at(i)), r);
      }
    });
  };
}

export function paintCurve(
  proj: Projection,
  model: Model,
  {
    style,
  }: {
    readonly style: GraphicsStyle;
  },
): ShapeList {
  return (g: Graphics): void => {
    g.withStyle(style, () => {
      const d = proj.box.width / 20;
      const s = (proj.xmax - proj.xmin) / d;
      for (let i = 0; i < d; i++) {
        const a = proj.xmin + i * s;
        const b = proj.xmin + (i + 1) * s;
        g.strokeLine(
          proj.x(a),
          proj.y(model.eval(a)),
          proj.x(b),
          proj.y(model.eval(b)),
        );
      }
    });
  };
}

export function paintHistogram(
  box: Rect,
  data: Vector,
  range: Range,
  {
    margin = 5,
    style,
  }: {
    readonly margin?: number;
    readonly style: GraphicsStyle;
  },
): ShapeList {
  const { min, max } = range;
  return Shapes.fill(
    style,
    vBoxes(box, [...data], { margin }).map(({ value, rect }) => {
      if (value > 0) {
        const width = rect.width;
        const height = Math.round(((value - min) / (max - min)) * box.height);
        const x = rect.x;
        const y = Math.round(box.y + box.height - height);
        return Shapes.rect({ x, y, width, height });
      } else {
        return null;
      }
    }),
  );
}
