import { useFormatter } from "@keybr/lesson-ui";
import { type Distribution, Range, Vector } from "@keybr/math";
import { Canvas, type Rect, type ShapeList, Shapes } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { Chart, chartArea, type SizeProps } from "./Chart.tsx";
import { paintAxis, paintGrid, paintNoData, paintTicks } from "./decoration.ts";
import { chartStyles } from "./styles.ts";

export type Threshold = {
  readonly label: string;
  readonly value: number;
};

export function DistributionChart({
  distribution,
  thresholds,
  width,
  height,
}: {
  readonly distribution: Distribution;
  readonly thresholds: readonly Threshold[];
} & SizeProps): ReactNode {
  const paint = usePaint(distribution, thresholds);
  return (
    <Chart width={width} height={height}>
      <Canvas paint={chartArea(paint)} />
    </Chart>
  );
}

function usePaint({ samples }: Distribution, thresholds: readonly Threshold[]) {
  const { formatMessage } = useIntl();
  const { formatSpeed } = useFormatter();

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
      thresholds.length > 0
        ? thresholds.map(paintThresholdLine)
        : paintNoData(box, formatMessage),
      paintAxis(box, "bottom"),
      paintAxis(box, "left"),
      paintTicks(box, rIndex, "bottom", { lines: 5, fmt: formatSpeed }),
    ];

    function paintHistogram(): ShapeList {
      return Shapes.fill(
        chartStyles.speed,
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
      if (value < rIndex.min || value > rIndex.max) {
        return [];
      }
      const x = Math.round((value - rIndex.min) * sx);
      return [
        Shapes.fill(chartStyles.threshold, [
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
          value: formatSpeed(value),
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
