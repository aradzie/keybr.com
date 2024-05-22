import { KeyFrequencyHeatmap, Marker } from "@keybr/chart";
import { useKeyboard } from "@keybr/keyboard";
import { type KeyStatsMap } from "@keybr/result";
import { Explainer, Figure } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function KeyFrequencyHeatmapSection({
  keyStatsMap,
}: {
  readonly keyStatsMap: KeyStatsMap;
}): ReactNode {
  const keyboard = useKeyboard();
  return (
    <Figure>
      <Figure.Caption>
        <FormattedMessage
          id="profile.chart.keyFrequencyHeatmap.caption"
          defaultMessage="Key Frequency Heatmap"
        />
      </Figure.Caption>

      <Explainer>
        <Figure.Description>
          <FormattedMessage
            id="profile.chart.keyFrequencyHeatmap.description"
            defaultMessage="This chart shows relative key frequencies as a heatmap."
          />
        </Figure.Description>
      </Explainer>

      <KeyFrequencyHeatmap keyStatsMap={keyStatsMap} keyboard={keyboard} />

      <Figure.Legend>
        <FormattedMessage
          id="profile.chart.keyFrequencyHeatmap.legend"
          defaultMessage="Circle color: {label1} – hit count, {label2} – miss count."
          values={{
            label1: <Marker type="histogram-h" />,
            label2: <Marker type="histogram-m" />,
          }}
        />
      </Figure.Legend>
    </Figure>
  );
}
