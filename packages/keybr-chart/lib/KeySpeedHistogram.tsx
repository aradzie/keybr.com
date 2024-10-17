import { useFormatter } from "@keybr/lesson-ui";
import { hasData, Histogram, KeySet, Range } from "@keybr/math";
import { type KeyStatsMap, timeToSpeed } from "@keybr/result";
import { Canvas, type Rect, type ShapeList } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { Chart, chartArea, type SizeProps } from "./Chart.tsx";
import { withStyles } from "./decoration.ts";
import { paintHistogram } from "./graph.ts";
import { type ChartStyles, useChartStyles } from "./use-chart-styles.ts";

export function KeySpeedHistogram({
  keyStatsMap,
  width,
  height,
}: {
  readonly keyStatsMap: KeyStatsMap;
} & SizeProps): ReactNode {
  const styles = useChartStyles();
  const paint = usePaint(styles, keyStatsMap);
  return (
    <Chart width={width} height={height}>
      <Canvas paint={chartArea(styles, paint)} />
    </Chart>
  );
}

function usePaint(styles: ChartStyles, keyStatsMap: KeyStatsMap) {
  const { formatMessage } = useIntl();
  const { formatSpeed } = useFormatter();
  const g = withStyles(styles);
  const { letters, results } = keyStatsMap;

  if (!hasData(results)) {
    return (box: Rect): ShapeList => {
      return [
        g.paintFrame(box),
        g.paintKeyTicks(box, letters, "bottom"),
        g.paintNoData(box, formatMessage),
      ];
    };
  }

  const keySet = new KeySet(letters);
  const hSpeed = new Histogram(keySet);
  for (const letter of letters) {
    const keyStats = keyStatsMap.get(letter);
    const { timeToType } = keyStats;
    if (timeToType != null) {
      hSpeed.set(letter, timeToSpeed(timeToType));
    }
  }
  const vSpeed = hSpeed.asVector();
  const rSpeed = Range.from(vSpeed).round(5);
  rSpeed.min = 0;
  return (box: Rect): ShapeList => {
    return [
      g.paintGrid(box, "horizontal"),
      paintHistogram(box, vSpeed, rSpeed, { style: styles.speed }),
      g.paintFrame(box),
      g.paintTicks(box, rSpeed, "left", { fmt: formatSpeed }),
      g.paintKeyTicks(box, letters, "bottom"),
    ];
  };
}
