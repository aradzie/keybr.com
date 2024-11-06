import { useFormatter } from "@keybr/lesson-ui";
import { Range, Vector } from "@keybr/math";
import { timeToSpeed } from "@keybr/result";
import { Canvas, type Rect, type ShapeList, Shapes } from "@keybr/widget";
import { type ReactNode } from "react";
import { Chart, chartArea, type SizeProps } from "./Chart.tsx";
import { withStyles } from "./decoration.ts";
import { bucketize } from "./dist/util.ts";
import { type TimeToType } from "./types.ts";
import { type ChartStyles, useChartStyles } from "./use-chart-styles.ts";

export function TimeToTypeHistogram({
  steps,
  width,
  height,
}: {
  readonly steps: readonly TimeToType[];
} & SizeProps): ReactNode {
  const styles = useChartStyles();
  const paint = usePaint(styles, steps);
  return (
    <Chart width={width} height={height}>
      <Canvas paint={chartArea(styles, paint)} />
    </Chart>
  );
}

function usePaint(styles: ChartStyles, steps: readonly TimeToType[]) {
  const { formatSpeed } = useFormatter();
  const g = withStyles(styles);

  const histogram = buildHistogram(steps);

  const vIndex = new Vector();
  const vValue = new Vector();
  for (let index = 0; index < histogram.length; index++) {
    vIndex.add(index);
    vValue.add(histogram[index]);
  }
  const rIndex = Range.from(vIndex);
  const rValue = Range.from(vValue);

  return (box: Rect): ShapeList => {
    return [
      g.paintGrid(box, "vertical", { lines: 5 }),
      g.paintGrid(box, "horizontal", { lines: 5 }),
      paintHistogram(),
      g.paintAxis(box, "bottom"),
      g.paintAxis(box, "left"),
      g.paintTicks(box, rIndex, "bottom", {
        lines: 5,
        fmt: formatSpeed,
        style: styles.valueLabel,
      }),
    ];

    function paintHistogram(): ShapeList {
      return Shapes.fill(
        styles.speed,
        [...rIndex.steps()].map((index) => {
          const w = Math.ceil(box.width / rIndex.span);
          const x = Math.round(rIndex.normalize(index, 1) * box.width);
          const y = Math.round(rValue.normalize(vValue.at(index)) * box.height);
          return Shapes.rect({
            x: box.x + x,
            y: box.y + box.height - y,
            width: w,
            height: y,
          });
        }),
      );
    }
  };
}

function buildHistogram(steps: readonly TimeToType[]) {
  const histogram = new Array(1501).fill(0);
  for (const { timeToType } of steps) {
    if (timeToType > 0) {
      const index = Math.round(timeToSpeed(timeToType));
      if (index >= 0 && index < histogram.length) {
        histogram[index] += 1;
      }
    }
  }
  return bucketize(histogram, 15);
}
