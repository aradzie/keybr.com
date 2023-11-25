import { useIntlNumbers } from "@keybr/intl";
import { useFormatter } from "@keybr/lesson-ui";
import { hasData, linearRegression, Range, smooth, Vector } from "@keybr/math";
import { type Result } from "@keybr/result";
import { Canvas, type Rect, type ShapeList } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { Chart, chartArea, type SizeProps } from "./Chart.tsx";
import { paintAxis, paintGrid, paintNoData, paintTicks } from "./decoration.ts";
import { paintCurve, paintScatterPlot, projection } from "./graph.ts";
import { chartStyles } from "./styles.ts";

export function SpeedChart({
  results,
  smoothness,
  width,
  height,
}: {
  readonly results: readonly Result[];
  readonly smoothness: number;
} & SizeProps): ReactNode {
  const paint = usePaint(results, smoothness);
  return (
    <Chart width={width} height={height}>
      <Canvas paint={chartArea(paint)} />
    </Chart>
  );
}

function usePaint(results: readonly Result[], smoothness: number) {
  const { formatMessage } = useIntl();
  const { formatInteger, formatPercents } = useIntlNumbers();
  const { formatSpeed } = useFormatter();

  if (!hasData(results)) {
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
  const vComplexity = new Vector();
  const sComplexity = smooth(smoothness);
  const vAccuracy = new Vector();
  const sAccuracy = smooth(smoothness);
  const vSpeed = new Vector();
  const sSpeed = smooth(smoothness);
  for (let index = 0; index < results.length; index++) {
    const result = results[index];
    vIndex.add(index + 1);
    vComplexity.add(sComplexity(result.histogram.complexity));
    vAccuracy.add(sAccuracy(result.accuracy));
    vSpeed.add(sSpeed(result.speed));
  }
  const rIndex = Range.from(vIndex);
  const rComplexity = Range.from(vComplexity).round(1);
  const rAccuracy = Range.from(vAccuracy).round(0.01);
  const rSpeed = Range.from(vSpeed).round(5);
  rComplexity.min = 3;

  const mSpeed = linearRegression(vIndex, vSpeed);

  return (box: Rect): ShapeList => {
    const projComplexity = projection(box, rIndex, rComplexity);
    const projAccuracy = projection(box, rIndex, rAccuracy);
    const projSpeed = projection(box, rIndex, rSpeed);
    return [
      paintGrid(box, "vertical", { lines: 5 }),
      paintGrid(box, "horizontal", { lines: 5 }),
      paintScatterPlot(projComplexity, vIndex, vComplexity, {
        style: chartStyles.complexity,
      }),
      paintScatterPlot(projAccuracy, vIndex, vAccuracy, {
        style: chartStyles.accuracy,
      }),
      paintScatterPlot(projSpeed, vIndex, vSpeed, {
        style: chartStyles.speed,
      }),
      paintCurve(projSpeed, mSpeed, {
        style: {
          ...chartStyles.speed,
          lineWidth: 2,
        },
      }),
      paintAxis(box, "left"),
      paintAxis(box, "bottom"),
      paintTicks(box, rIndex, "bottom", { lines: 5, fmt: formatInteger }),
      paintTicks(box, rSpeed, "left", { fmt: formatSpeed }),
      paintTicks(box, rAccuracy, "right", { fmt: formatPercents }),
    ];
  };
}
