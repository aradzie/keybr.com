import { useIntlNumbers } from "@keybr/intl";
import { Target } from "@keybr/lesson";
import { useFormatter } from "@keybr/lesson-ui";
import {
  constModel,
  hasData,
  linearRegression,
  Range,
  smooth,
  Vector,
} from "@keybr/math";
import { type KeySample, timeToSpeed } from "@keybr/result";
import { useSettings } from "@keybr/settings";
import { Canvas, type Rect, type ShapeList } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { Chart, chartArea, type SizeProps } from "./Chart.tsx";
import { withStyles } from "./decoration.ts";
import { paintCurve, paintScatterPlot, projection } from "./graph.ts";
import { type ChartStyles, useChartStyles } from "./use-chart-styles.ts";

export function KeySpeedChart({
  samples,
  smoothness,
  width,
  height,
}: {
  readonly samples: readonly KeySample[];
  readonly smoothness: number;
} & SizeProps): ReactNode {
  const styles = useChartStyles();
  const paint = usePaint(styles, samples, smoothness);
  return (
    <Chart width={width} height={height}>
      <Canvas paint={chartArea(styles, paint)} />
    </Chart>
  );
}

function usePaint(
  styles: ChartStyles,
  samples: readonly KeySample[],
  smoothness: number,
) {
  const { formatMessage } = useIntl();
  const { formatInteger } = useIntlNumbers();
  const { formatSpeed } = useFormatter();
  const { settings } = useSettings();
  const target = new Target(settings);
  const g = withStyles(styles);

  if (!hasData(samples)) {
    return (box: Rect): ShapeList => {
      return [
        g.paintGrid(box, "vertical", { lines: 5 }),
        g.paintGrid(box, "horizontal", { lines: 5 }),
        g.paintAxis(box, "left"),
        g.paintAxis(box, "bottom"),
        g.paintNoData(box, formatMessage),
      ];
    };
  }

  const vIndex = new Vector();
  const vSpeed = new Vector();
  const sSpeed = smooth(smoothness);
  for (let index = 0; index < samples.length; index++) {
    const sample = samples[index];
    vIndex.add(index + 1);
    vSpeed.add(sSpeed(timeToSpeed(sample.timeToType)));
  }
  const rIndex = Range.from(vIndex);
  const rSpeed = Range.from(vSpeed);
  rSpeed.min = target.targetSpeed;
  rSpeed.max = target.targetSpeed;
  rSpeed.round(5);

  const mSpeed = linearRegression(vIndex, vSpeed);

  return (box: Rect): ShapeList => {
    const proj = projection(box, rIndex, rSpeed);
    return [
      g.paintGrid(box, "vertical", { lines: 5 }),
      g.paintGrid(box, "horizontal", { lines: 5 }),
      paintScatterPlot(proj, vIndex, vSpeed, {
        style: styles.speed,
      }),
      paintCurve(proj, mSpeed, {
        style: {
          ...styles.speed,
          lineWidth: 2,
        },
      }),
      paintCurve(proj, constModel(target.targetSpeed), {
        style: {
          ...styles.threshold,
          lineWidth: 2,
        },
      }),
      g.paintAxis(box, "left"),
      g.paintAxis(box, "bottom"),
      g.paintTicks(box, rSpeed, "left", { fmt: formatSpeed }),
      g.paintTicks(box, rIndex, "bottom", { lines: 5, fmt: formatInteger }),
    ];
  };
}
