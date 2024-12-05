import { useFormatter } from "@keybr/lesson-ui";
import { Range, Vector } from "@keybr/math";
import { computeSpeed, type Stats, type Step } from "@keybr/textinput";
import {
  Canvas,
  formatDuration,
  type Rect,
  type ShapeList,
  Shapes,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { Chart, chartArea, type SizeProps } from "./Chart.tsx";
import { withStyles } from "./decoration.ts";
import { paintScatterPlot, projection } from "./graph.ts";
import { type ChartStyles, useChartStyles } from "./use-chart-styles.ts";

export function RollingSpeedChart({
  stats,
  steps,
  width,
  height,
}: {
  readonly stats: Stats;
  readonly steps: readonly Step[];
} & SizeProps): ReactNode {
  const styles = useChartStyles();
  const paint = usePaint(styles, stats, steps);
  return (
    <Chart width={width} height={height}>
      <Canvas paint={chartArea(styles, paint)} />
    </Chart>
  );
}

function usePaint(styles: ChartStyles, stats: Stats, steps: readonly Step[]) {
  const { formatSpeed } = useFormatter();
  const g = withStyles(styles);

  const vTime = new Vector();
  const vSpeed = new Vector();
  const vBumps = new Vector();
  const head = steps[0];
  for (let index = 1; index < steps.length; index++) {
    const delta = Math.min(10, index);
    const prev = steps[index - delta];
    const curr = steps[index];
    const speed = computeSpeed(delta, curr.timeStamp - prev.timeStamp);
    vTime.add(curr.timeStamp - head.timeStamp);
    vSpeed.add(speed);
    if (curr.typo) {
      vBumps.add(curr.timeStamp - head.timeStamp);
    }
  }

  const rTime = Range.from(vTime);
  const rSpeed = Range.from(vSpeed);

  return (box: Rect): ShapeList => {
    const proj = projection(box, rTime, rSpeed);
    return [
      g.paintGrid(box, "horizontal", { lines: 5 }),
      g.paintGrid(box, "vertical", { lines: 5 }),
      g.paintAxis(box, "bottom"),
      g.paintAxis(box, "left"),
      paintScatterPlot(proj, vTime, vSpeed, {
        style: styles.speed,
      }),
      pointAverageSpeedLine(),
      paintBumps(),
      g.paintTicks(box, rTime, "bottom", {
        lines: 5,
        fmt: (value) => formatDuration(value, { showMillis: true }),
      }),
      g.paintTicks(box, rSpeed, "left", { fmt: formatSpeed }),
    ];

    function pointAverageSpeedLine(): ShapeList {
      const y = Math.round(proj.y(stats.speed));
      return [
        Shapes.fill(styles.threshold, [
          Shapes.rect({
            x: box.x - 10,
            y: y,
            width: box.width + 20,
            height: 1,
          }),
        ]),
        Shapes.fillText({
          x: box.x + box.width + 15,
          y: y,
          value: formatSpeed(stats.speed),
          style: {
            ...styles.thresholdLabel,
            textAlign: "left",
            textBaseline: "middle",
          },
        }),
      ];
    }

    function paintBumps(): ShapeList {
      const r = Math.round(
        Math.min(Math.max(proj.box.width / vTime.length, 2), 6),
      );
      return Shapes.fill(
        styles.accuracy,
        [...vBumps].map((time) => {
          const x = Math.round(proj.x(time));
          return [
            Shapes.rect({
              x: x,
              y: box.y,
              width: 1,
              height: box.height,
            }),
            Shapes.circle({
              cx: x,
              cy: box.y + box.height,
              r,
            }),
          ];
        }),
      );
    }
  };
}
