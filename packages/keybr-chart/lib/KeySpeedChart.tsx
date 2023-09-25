import { useIntlNumbers } from "@keybr/intl";
import { SPEED_THRESHOLD } from "@keybr/lesson";
import { useFormatter } from "@keybr/lesson-ui";
import { constModel, linearRegression } from "@keybr/math";
import { type KeySample, timeToSpeed } from "@keybr/result";
import { Canvas, type Rect, type ShapeList } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { Chart, chartArea, type SizeProps } from "./Chart.tsx";
import { hasData, Range, smooth, Vector } from "./data.ts";
import { paintAxis, paintGrid, paintNoData, paintTicks } from "./decoration.ts";
import { paintCurve, paintScatterPlot, projection } from "./graph.ts";
import { chartStyles } from "./styles.ts";

export function KeySpeedChart({
  samples,
  smoothness,
  width,
  height,
}: {
  readonly samples: readonly KeySample[];
  readonly smoothness: number;
} & SizeProps): ReactNode {
  const paint = usePaint(samples, smoothness);
  return (
    <Chart width={width} height={height}>
      <Canvas paint={chartArea(paint)} />
    </Chart>
  );
}

function usePaint(samples: readonly KeySample[], smoothness: number) {
  const { formatMessage } = useIntl();
  const { formatInteger } = useIntlNumbers();
  const fmt = useFormatter();

  if (!hasData(samples)) {
    return (box: Rect): ShapeList => {
      return [
        paintGrid(box, "vertical", { lines: 5 }),
        paintGrid(box, "horizontal", { lines: 5 }),
        paintAxis(box, "left"),
        paintAxis(box, "bottom"),
        paintNoData(box, formatMessage),
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
  rSpeed.min = SPEED_THRESHOLD;
  rSpeed.max = SPEED_THRESHOLD;
  rSpeed.round(5);

  const mSpeed = linearRegression(vIndex.values, vSpeed.values);

  return (box: Rect): ShapeList => {
    const proj = projection(box, rIndex, rSpeed);
    return [
      paintGrid(box, "vertical", { lines: 5 }),
      paintGrid(box, "horizontal", { lines: 5 }),
      paintScatterPlot(proj, vIndex, vSpeed, {
        style: chartStyles.speedLine,
      }),
      paintCurve(proj, mSpeed, {
        style: {
          ...chartStyles.speedLine,
          lineWidth: 2,
        },
      }),
      paintCurve(proj, constModel(SPEED_THRESHOLD), {
        style: {
          ...chartStyles.thresholdLine,
          lineWidth: 2,
        },
      }),
      paintAxis(box, "left"),
      paintAxis(box, "bottom"),
      paintTicks(box, rSpeed, "left", { fmt }),
      paintTicks(box, rIndex, "bottom", { lines: 5, fmt: formatInteger }),
    ];
  };
}
