import { Rect, type ShapeList, Shapes, type Size } from "@keybr/widget";
import { type ReactNode } from "react";
import { type ChartStyles } from "./use-chart-styles.ts";

export type SizeProps = {
  readonly width: string;
  readonly height: string;
};

export function Chart({
  children,
  width,
  height,
}: {
  readonly children: ReactNode;
} & SizeProps): ReactNode {
  return (
    <div
      style={{
        display: "block",
        position: "relative",
        insetInlineStart: "0px",
        insetBlockStart: "0px",
        inlineSize: width,
        blockSize: height,
        margin: "0px",
        padding: "0px",
        borderStyle: "none",
      }}
    >
      {children}
    </div>
  );
}

export function chartArea(styles: ChartStyles, cb: (d: Rect) => ShapeList) {
  return ({ width, height }: Size) => {
    const h = styles.lineHeight * 5;
    const v = styles.lineHeight * 2;
    const area = new Rect(h, v, width - h * 2, height - v * 2).round();
    return [Shapes.clear(), cb(area)];
  };
}
