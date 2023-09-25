import { KeyFrequencyHeatmap } from "@keybr/chart";
import { useKeyboard } from "@keybr/keyboard";
import { type KeyStatsMap } from "@keybr/result";
import { Figure } from "@keybr/widget";
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
          id="profile.chart.keyFrequencyHeatmapCaption"
          description="Chart caption."
          defaultMessage="Key Frequency Heatmap"
        />
      </Figure.Caption>

      <Figure.Description>
        <FormattedMessage
          id="profile.chart.keyFrequencyHeatmapDescription"
          description="Chart description."
          defaultMessage="This chart shows relative key frequencies as a heatmap."
        />
      </Figure.Description>

      <KeyFrequencyHeatmap keyStatsMap={keyStatsMap} keyboard={keyboard} />
    </Figure>
  );
}
