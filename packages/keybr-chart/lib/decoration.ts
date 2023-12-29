import { type Range } from "@keybr/math";
import {
  type GraphicsStyle,
  type Rect,
  type ShapeList,
  Shapes,
} from "@keybr/widget";
import { type MessageDescriptor } from "react-intl";
import { hBoxes, hTicks, vBoxes, vTicks } from "./geometry.ts";
import { chartStyles } from "./styles.ts";

export type Edge = "left" | "right" | "top" | "bottom";

export function paintGrid(
  box: Rect,
  direction: "vertical" | "horizontal",
  {
    lines = 3,
    style = chartStyles.lighterFrame,
  }: {
    readonly lines?: number;
    readonly style?: GraphicsStyle;
  } = {},
): ShapeList {
  switch (direction) {
    case "vertical":
      return Shapes.fill(
        style,
        vTicks(box, makeRange(0, lines)).map(({ point }) =>
          Shapes.rect({
            x: point.x,
            y: point.y,
            width: 1,
            height: box.height,
          }),
        ),
      );
    case "horizontal":
      return Shapes.fill(
        style,
        hTicks(box, makeRange(0, lines)).map(({ point }) =>
          Shapes.rect({
            x: point.x,
            y: point.y,
            width: box.width,
            height: 1,
          }),
        ),
      );
  }
}

export function paintFrame(
  box: Rect,
  {
    style = chartStyles.frame,
  }: {
    readonly style?: GraphicsStyle;
  } = {},
): ShapeList {
  return Shapes.fill(style, [
    // top
    Shapes.rect({
      x: box.x - 1,
      y: box.y - 1,
      width: box.width + 2,
      height: 1,
    }),
    // bottom
    Shapes.rect({
      x: box.x - 1,
      y: box.y + box.height,
      width: box.width + 2,
      height: 1,
    }),
    // left
    Shapes.rect({
      x: box.x - 1,
      y: box.y - 1,
      width: 1,
      height: box.height + 2,
    }),
    // right
    Shapes.rect({
      x: box.x + box.width,
      y: box.y - 1,
      width: 1,
      height: box.height + 2,
    }),
  ]);
}

export function paintAxis(
  box: Rect,
  edge: Edge,
  {
    margin = 20,
    style = chartStyles.frame,
  }: {
    readonly margin?: number;
    readonly style?: GraphicsStyle;
  } = {},
): ShapeList {
  switch (edge) {
    case "left":
      return Shapes.fill(
        style,
        Shapes.rect({
          x: box.x - 1,
          y: box.y - margin,
          width: 3,
          height: box.height + margin,
        }),
      );
    case "right":
      return Shapes.fill(
        style,
        Shapes.rect({
          x: box.x + box.width + 1,
          y: box.y - margin,
          width: 3,
          height: box.height + margin,
        }),
      );
    case "top":
      return Shapes.fill(
        style,
        Shapes.rect({
          x: box.x,
          y: box.y - 1,
          width: box.width + margin,
          height: 3,
        }),
      );
    case "bottom":
      return Shapes.fill(
        style,
        Shapes.rect({
          x: box.x,
          y: box.y + box.height - 1,
          width: box.width + margin,
          height: 3,
        }),
      );
  }
}

export function paintTicks(
  box: Rect,
  range: Range,
  edge: Edge,
  {
    lines = 3,
    fmt = String,
    style = chartStyles.valueLabel,
  }: {
    readonly lines?: number;
    readonly fmt?: (value: number) => unknown;
    readonly style?: GraphicsStyle;
  } = {},
): ShapeList {
  switch (edge) {
    case "left": {
      style = { ...style, textAlign: "right", textBaseline: "middle" };
      return hTicks(box, makeTicks(range, lines)).map(
        ({ value, point: { x, y } }) =>
          Shapes.fillText({
            value: fmt(value),
            x: x - 5,
            y,
            style,
          }),
      );
    }
    case "right": {
      style = { ...style, textAlign: "left", textBaseline: "middle" };
      return hTicks(box, makeTicks(range, lines)).map(
        ({ value, point: { x, y } }) =>
          Shapes.fillText({
            value: fmt(value),
            x: x + box.width + 5,
            y,
            style,
          }),
      );
    }
    case "top": {
      style = { ...style, textAlign: "center", textBaseline: "bottom" };
      return vTicks(box, makeTicks(range, lines)).map(
        ({ value, point: { x, y } }) =>
          Shapes.fillText({
            value: fmt(value),
            x,
            y: y - 5,
            style,
          }),
      );
    }
    case "bottom": {
      style = { ...style, textAlign: "center", textBaseline: "top" };
      return vTicks(box, makeTicks(range, lines)).map(
        ({ value, point: { x, y } }) =>
          Shapes.fillText({
            value: fmt(value),
            x,
            y: y + box.height + 5,
            style,
          }),
      );
    }
  }
}

export function paintKeyTicks<T>(
  box: Rect,
  items: readonly T[],
  edge: Edge,
  {
    margin = 5,
    fmt = String,
    style = chartStyles.keyLabel,
  }: {
    readonly margin?: number;
    readonly fmt?: (item: T) => unknown;
    readonly style?: GraphicsStyle;
  } = {},
): ShapeList {
  switch (edge) {
    case "left": {
      style = { ...style, textAlign: "right", textBaseline: "middle" };
      return hBoxes(box, items, { margin }).map(({ value, rect }) =>
        Shapes.fillText({
          value: fmt(value),
          x: box.x - 4,
          y: rect.cy,
          style,
        }),
      );
    }
    case "right": {
      style = { ...style, textAlign: "left", textBaseline: "middle" };
      return hBoxes(box, items, { margin }).map(({ value, rect }) =>
        Shapes.fillText({
          value: fmt(value),
          x: box.x + box.width + 4,
          y: rect.cy,
          style,
        }),
      );
    }
    case "top": {
      style = { ...style, textAlign: "center", textBaseline: "bottom" };
      return vBoxes(box, items, { margin }).map(({ value, rect }) =>
        Shapes.fillText({
          value: fmt(value),
          x: rect.cx,
          y: box.y - 3,
          style,
        }),
      );
    }
    case "bottom": {
      style = { ...style, textAlign: "center", textBaseline: "top" };
      return vBoxes(box, items, { margin }).map(({ value, rect }) =>
        Shapes.fillText({
          value: fmt(value),
          x: rect.cx,
          y: box.y + box.height + 3,
          style,
        }),
      );
    }
  }
}

export function paintNoData(
  box: Rect,
  formatMessage: (d: MessageDescriptor) => string,
): ShapeList {
  return [
    Shapes.fillText({
      value: formatMessage({
        id: "profile.emptyChart.header",
        defaultMessage: "Not enough data",
      }),
      x: box.cx,
      y: box.cy,
      style: {
        ...chartStyles.headerText,
        textAlign: "center",
        textBaseline: "bottom",
      },
    }),
    Shapes.fillText({
      value: formatMessage({
        id: "profile.emptyChart.description",
        defaultMessage: "Complete a few more lessons to get more data points.",
      }),
      x: box.cx,
      y: box.cy,
      style: {
        ...chartStyles.subheaderText,
        textAlign: "center",
        textBaseline: "top",
      },
    }),
  ];
}

function makeTicks({ min, max }: Range, count: number): number[] {
  if (count < 2) {
    throw new Error();
  }
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(((max - min) / (count - 1)) * i + min);
  }
  return result;
}

function makeRange(from: number, to: number): number[] {
  return new Array<number>(to - from).fill(0).map((_, index) => index + from);
}
