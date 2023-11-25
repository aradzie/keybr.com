import { useIntlNumbers } from "@keybr/intl";
import { type LearningRate, type LessonKey, Target } from "@keybr/lesson";
import { useFormatter } from "@keybr/lesson-ui";
import { constModel, Range } from "@keybr/math";
import { useSettings } from "@keybr/settings";
import { Canvas, type Rect, type ShapeList, Shapes } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { Chart, chartArea, type SizeProps } from "./Chart.tsx";
import { paintAxis, paintGrid, paintNoData, paintTicks } from "./decoration.ts";
import { paintCurve, paintScatterPlot, projection } from "./graph.ts";
import { chartStyles } from "./styles.ts";

export function KeyDetailsChart({
  lessonKey,
  learningRate,
  width,
  height,
}: {
  readonly lessonKey: LessonKey;
  readonly learningRate: LearningRate | null;
} & SizeProps): ReactNode {
  const paint = usePaint(lessonKey, learningRate);
  return (
    <Chart width={width} height={height}>
      <Canvas paint={chartArea(paint)} />
    </Chart>
  );
}

function usePaint(lessonKey: LessonKey, learningRate: LearningRate | null) {
  const { formatMessage } = useIntl();
  const { formatInteger } = useIntlNumbers();
  const { formatSpeed } = useFormatter();
  const { settings } = useSettings();
  const target = new Target(settings);

  if (learningRate == null) {
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

  const { vIndex, vSpeed, mSpeed } = learningRate;

  const rIndex = Range.from(vIndex);
  const rSpeed = Range.from(vSpeed);
  rSpeed.min = target.targetSpeed;
  rSpeed.max = target.targetSpeed;
  rSpeed.round(5);

  let now = 0;
  if ((lessonKey.bestConfidence ?? 0) < 1) {
    now = rIndex.max;
    rIndex.max = now + 10;
  }

  return (box: Rect): ShapeList => {
    const proj = projection(box, rIndex, rSpeed);
    return [
      paintGrid(box, "vertical", { lines: 5 }),
      paintGrid(box, "horizontal", { lines: 5 }),
      now > 0 && paintThresholdLine({ label: "Now", value: now }),
      paintScatterPlot(proj, vIndex, vSpeed, {
        style: chartStyles.speed,
      }),
      paintCurve(proj, mSpeed, {
        style: {
          ...chartStyles.speed,
          lineWidth: 2,
        },
      }),
      paintCurve(proj, constModel(target.targetSpeed), {
        style: {
          ...chartStyles.threshold,
          lineWidth: 2,
        },
      }),
      paintAxis(box, "left"),
      paintAxis(box, "bottom"),
      paintTicks(box, rSpeed, "left", { fmt: formatSpeed }),
      paintTicks(box, rIndex, "bottom", { lines: 5, fmt: formatInteger }),
    ];

    function paintThresholdLine({
      label,
      value,
    }: {
      label: string;
      value: number;
    }): ShapeList {
      const x = proj.x(value);
      return [
        Shapes.fill(chartStyles.threshold, [
          Shapes.rect({
            x: Math.round(x),
            y: box.y - 10,
            width: 1,
            height: box.height + 20,
          }),
        ]),
        Shapes.fillText({
          x: Math.round(x) + 2,
          y: box.y - 1,
          value: label,
          style: {
            ...chartStyles.thresholdLabel,
            textAlign: "left",
            textBaseline: "bottom",
          },
        }),
      ];
    }
  };
}
