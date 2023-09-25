import { useFormatter } from "@keybr/lesson-ui";
import { newSummaryStats, type Result } from "@keybr/result";
import { Canvas, type Rect, type ShapeList, Shapes } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { Chart, chartArea, type SizeProps } from "./Chart.tsx";
import { hasData, Range, Vector } from "./data.ts";
import { paintAxis, paintGrid, paintNoData, paintTicks } from "./decoration.ts";
import { type Distribution } from "./dist.ts";
import { chartStyles } from "./styles.ts";

export function DistributionChart({
  results,
  distribution,
  width,
  height,
}: {
  readonly results: readonly Result[];
  readonly distribution: Distribution;
} & SizeProps): ReactNode {
  const paint = usePaint(results, distribution);
  return (
    <Chart width={width} height={height}>
      <Canvas paint={chartArea(paint)} />
    </Chart>
  );
}

function usePaint(results: readonly Result[], { samples }: Distribution) {
  const { formatMessage } = useIntl();
  const fmt = useFormatter();

  const stats = newSummaryStats(results);
  const vIndex = new Vector();
  const vValue = new Vector();
  for (let index = 0; index < samples.length; index++) {
    vIndex.add(index);
    vValue.add(samples[index]);
  }
  const rIndex = Range.from(vIndex);
  const rValue = Range.from(vValue);

  return (box: Rect): ShapeList => {
    const sx = box.width / rIndex.span;
    const sy = box.height / rValue.span;

    return [
      paintGrid(box, "vertical", { lines: 5 }),
      paintGrid(box, "horizontal", { lines: 5 }),
      paintHistogram(),
      hasData(results)
        ? [
            paintThresholdLine({
              label: "All time average",
              value: stats.speed.avg,
            }),
            paintThresholdLine({
              label: "All time top",
              value: stats.speed.max,
            }),
          ]
        : paintNoData(box, formatMessage),
      paintAxis(box, "bottom"),
      paintAxis(box, "left"),
      paintTicks(box, rIndex, "bottom", { lines: 5, fmt }),
    ];

    function paintHistogram(): ShapeList {
      return Shapes.fill(
        chartStyles.speedLine,
        samples.map((value, index) => {
          const w = Math.ceil(sx);
          const h = Math.round((value - rValue.min) * sy);
          const x = Math.round((index - rIndex.min) * sx);
          const y = box.height - h;
          return Shapes.rect({
            x: box.x + x,
            y: box.y + y,
            width: w,
            height: h,
          });
        }),
      );
    }

    function paintThresholdLine({
      label,
      value,
    }: {
      label: string;
      value: number;
    }): ShapeList {
      const x = Math.round((value - rIndex.min) * sx);
      return [
        Shapes.fill(chartStyles.thresholdLine, [
          Shapes.rect({
            x: box.x + x,
            y: box.y - 10,
            width: 1,
            height: box.height + 20,
          }),
        ]),
        Shapes.fillText({
          x: box.x + x + 2,
          y: box.y + 1,
          value: fmt(value),
          style: {
            ...chartStyles.thresholdLabel,
            textAlign: "left",
            textBaseline: "top",
          },
        }),
      ];
    }
  };
}
