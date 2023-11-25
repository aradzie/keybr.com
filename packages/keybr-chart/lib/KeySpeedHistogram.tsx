import { useFormatter } from "@keybr/lesson-ui";
import { hasData, Histogram, KeySet, Range } from "@keybr/math";
import { type KeyStatsMap, timeToSpeed } from "@keybr/result";
import { Canvas, type Rect, type ShapeList } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { Chart, chartArea, type SizeProps } from "./Chart.tsx";
import {
  paintFrame,
  paintGrid,
  paintKeyTicks,
  paintNoData,
  paintTicks,
} from "./decoration.ts";
import { paintHistogram } from "./graph.ts";
import { chartStyles } from "./styles.ts";

export function KeySpeedHistogram({
  keyStatsMap,
  width,
  height,
}: {
  readonly keyStatsMap: KeyStatsMap;
} & SizeProps): ReactNode {
  const paint = usePaint(keyStatsMap);
  return (
    <Chart width={width} height={height}>
      <Canvas paint={chartArea(paint)} />
    </Chart>
  );
}

function usePaint(keyStatsMap: KeyStatsMap) {
  const { formatMessage } = useIntl();
  const { formatSpeed } = useFormatter();

  const { letters, results } = keyStatsMap;

  if (!hasData(results)) {
    return (box: Rect): ShapeList => {
      return [
        paintFrame(box),
        paintKeyTicks(box, letters, "bottom"),
        paintNoData(box, formatMessage),
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
      paintGrid(box, "horizontal"),
      paintHistogram(box, vSpeed, rSpeed, { style: chartStyles.speed }),
      paintFrame(box),
      paintTicks(box, rSpeed, "left", { fmt: formatSpeed }),
      paintKeyTicks(box, letters, "bottom"),
    ];
  };
}
