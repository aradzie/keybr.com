import { hasData, Range } from "@keybr/math";
import { type KeyStatsMap } from "@keybr/result";
import { Canvas, Rect, type ShapeList } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { Chart, chartArea, type SizeProps } from "./Chart.tsx";
import { withStyles } from "./decoration.ts";
import { paintHistogram } from "./graph.ts";
import { keyUsage } from "./keyusage.ts";
import { type ChartStyles, useChartStyles } from "./use-chart-styles.ts";

export function KeyFrequencyHistogram({
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
  const g = withStyles(styles);
  const { letters, results } = keyStatsMap;

  if (!hasData(results)) {
    return (box: Rect): ShapeList => {
      const [boxHit, boxMiss, boxRatio] = boxes(box);
      return [
        g.paintFrame(boxHit),
        g.paintFrame(boxMiss),
        g.paintFrame(boxRatio),
        g.paintKeyTicks(box, letters, "bottom"),
        g.paintNoData(boxHit, formatMessage),
      ];
    };
  }

  const { hit, miss, ratio } = keyUsage(keyStatsMap);
  const vHit = hit.asVector();
  const vMiss = miss.asVector();
  const vRatio = ratio.asVector();
  const rHit = Range.from(vHit);
  const rMiss = Range.from(vMiss);
  const rRatio = Range.from(vRatio);
  return (box: Rect): ShapeList => {
    const [boxHit, boxMiss, boxRatio] = boxes(box);
    return [
      paintHistogram(boxHit, vHit, rHit, {
        style: styles.histHit,
      }),
      paintHistogram(boxMiss, vMiss, rMiss, {
        style: styles.histMiss,
      }),
      paintHistogram(boxRatio, vRatio, rRatio, {
        style: styles.histRatio,
      }),
      g.paintFrame(boxHit),
      g.paintFrame(boxMiss),
      g.paintFrame(boxRatio),
      g.paintKeyTicks(box, letters, "bottom"),
    ];
  };
}

function boxes(box: Rect) {
  const boxHit = new Rect(box.x, box.y, box.width, box.height * 0.34);
  const boxMiss = new Rect(
    box.x,
    boxHit.y + boxHit.height + 10,
    box.width,
    box.height * 0.33 - 10,
  );
  const boxRatio = new Rect(
    box.x,
    boxMiss.y + boxMiss.height + 10,
    box.width,
    box.height * 0.33 - 10,
  );
  return [boxHit.round(), boxMiss.round(), boxRatio.round()];
}
