import { useIntlNumbers } from "@keybr/intl";
import { useFormatter } from "@keybr/lesson-ui";
import { hasData, linearRegression, Range, smooth, Vector } from "@keybr/math";
import { type Result } from "@keybr/result";
import { Canvas, type Rect, type ShapeList } from "@keybr/widget";
import { type ReactNode, useMemo } from "react";
import { useIntl } from "react-intl";
import { Chart, chartArea, type SizeProps } from "./Chart.tsx";
import { withStyles } from "./decoration.ts";
import { paintCurve, paintScatterPlot, projection } from "./graph.ts";
import { type ChartStyles, useChartStyles } from "./use-chart-styles.ts";

export const PLOT_MASK = {
  all: 0b111,
  accuracy: 0b001,
  speed: 0b010,
  complexity: 0b100,
} as const;

export function SpeedChart({
  results,
  smoothness,
  width,
  height,
  plotsVisible,
}: {
  readonly results: readonly Result[];
  readonly smoothness: number;
  readonly plotsVisible?: number;
} & SizeProps): ReactNode {
  const styles = useChartStyles();
  const paint = usePaint(styles, results, smoothness);
  const resolvedPlotsVisible = plotsVisible ?? PLOT_MASK.all;
  const paintWithVisiblePlots = useMemo(() => {
    return paint(resolvedPlotsVisible);
  }, [paint, resolvedPlotsVisible]);
  return (
    <Chart width={width} height={height}>
      <Canvas paint={chartArea(styles, paintWithVisiblePlots)} />
    </Chart>
  );
}

function usePaint(
  styles: ChartStyles,
  results: readonly Result[],
  smoothness: number,
) {
  const { formatMessage } = useIntl();
  const { formatInteger, formatPercents } = useIntlNumbers();
  const { formatSpeed } = useFormatter();
  const g = withStyles(styles);

  if (!hasData(results)) {
    return (_: number) => {
      return (box: Rect): ShapeList => {
        return [
          g.paintGrid(box, "horizontal", { lines: 5 }),
          g.paintGrid(box, "vertical", { lines: 5 }),
          g.paintAxis(box, "bottom"),
          g.paintAxis(box, "left"),
          g.paintNoData(box, formatMessage),
        ];
      };
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

  return (plotsVisible: number) => {
    return (box: Rect): ShapeList => {
      const plots: ShapeList[] = [];

      if ((plotsVisible & PLOT_MASK.complexity) !== 0) {
        const projComplexity = projection(box, rIndex, rComplexity);
        plots.push(
          paintScatterPlot(projComplexity, vIndex, vComplexity, {
            style: styles.complexity,
          }),
        );
      }
      if ((plotsVisible & PLOT_MASK.accuracy) !== 0) {
        const projAccuracy = projection(box, rIndex, rAccuracy);
        plots.push(
          paintScatterPlot(projAccuracy, vIndex, vAccuracy, {
            style: styles.accuracy,
          }),
        );
      }
      if ((plotsVisible & PLOT_MASK.speed) !== 0) {
        const projSpeed = projection(box, rIndex, rSpeed);
        plots.push(
          paintScatterPlot(projSpeed, vIndex, vSpeed, {
            style: styles.speed,
          }),
        );
        plots.push(
          paintCurve(projSpeed, mSpeed, {
            style: {
              ...styles.speed,
              lineWidth: 2,
            },
          }),
        );
      }

      return [
        g.paintGrid(box, "horizontal", { lines: 5 }),
        g.paintGrid(box, "vertical", { lines: 5 }),
        g.paintAxis(box, "bottom"),
        g.paintAxis(box, "left"),
        ...plots,
        g.paintTicks(box, rIndex, "bottom", { lines: 5, fmt: formatInteger }),
        g.paintTicks(box, rSpeed, "left", { fmt: formatSpeed }),
        g.paintTicks(box, rAccuracy, "right", { fmt: formatPercents }),
      ];
    };
  };
}
