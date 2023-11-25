import { useIntlNumbers } from "@keybr/intl";
import { Target } from "@keybr/lesson";
import { confidenceColor } from "@keybr/lesson-ui";
import { hasData, Range, resample, Vector } from "@keybr/math";
import { type KeyStats, type KeyStatsMap } from "@keybr/result";
import { useSettings } from "@keybr/settings";
import {
  Canvas,
  type Graphics,
  type Rect,
  type ShapeList,
  Shapes,
} from "@keybr/widget";
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
import { hBoxes } from "./geometry.ts";
import { chartStyles } from "./styles.ts";

export function ProgressOverviewChart({
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
  const { formatInteger } = useIntlNumbers();
  const { settings } = useSettings();
  const target = new Target(settings);
  const { letters, results } = keyStatsMap;

  const vIndex = new Vector();
  for (let index = 0; index < results.length; index++) {
    vIndex.add(index + 1);
  }
  const rIndex = Range.from(vIndex);

  return (box: Rect): ShapeList => {
    const boxes = hBoxes(box, letters, { margin: 4 });
    return [
      paintGrid1(),
      hasData(results)
        ? [
            paintGrid(box, "vertical", { lines: 5 }),
            paintTicks(box, rIndex, "bottom", { lines: 5, fmt: formatInteger }),
            paintGraph,
          ]
        : paintNoData(box, formatMessage),
      paintFrame(box),
      paintKeyTicks(box, letters, "left", { margin: 4 }),
    ];

    function paintGrid1(): ShapeList {
      return Shapes.fill(chartStyles.lighterFrame, [
        boxes.map(({ rect }) =>
          Shapes.rect({
            x: rect.x,
            y: rect.cy,
            width: rect.width,
            height: 1,
          }),
        ),
      ]);
    }

    function paintGraph(g: Graphics): void {
      for (const {
        value: letter,
        rect: { x, y, width, height },
      } of boxes) {
        const keyData = resample(
          makeKeyData(keyStatsMap.get(letter)),
          Math.floor(width),
        );
        for (let i = 0; i < keyData.length; i++) {
          const value = keyData[i];
          if (value === value) {
            g.fillStyle = confidenceColor(value);
            g.fillRect(x + i, y, 1, height);
          }
        }
      }
    }

    function makeKeyData({ samples }: KeyStats): number[] {
      const data = new Array<number>(results.length).fill(NaN);
      for (const { index, timeToType } of samples) {
        if (timeToType != null) {
          data[index] = target.confidence(timeToType);
        }
      }
      return data;
    }
  };
}
