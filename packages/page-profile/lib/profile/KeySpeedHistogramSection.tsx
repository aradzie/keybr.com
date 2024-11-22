import { KeySpeedHistogram } from "@keybr/chart";
import { type KeyStatsMap } from "@keybr/result";
import { Explainer, Figure } from "@keybr/widget";
import { FormattedMessage } from "react-intl";
import { ChartWrapper } from "./ChartWrapper.tsx";

export function KeySpeedHistogramSection({
  keyStatsMap,
}: {
  keyStatsMap: KeyStatsMap;
}) {
  return (
    <Figure>
      <Figure.Caption>
        <FormattedMessage
          id="profile.chart.keySpeedHistogram.caption"
          defaultMessage="Key Typing Speed Histogram"
        />
      </Figure.Caption>

      <Explainer>
        <Figure.Description>
          <FormattedMessage
            id="profile.chart.keySpeedHistogram.description"
            defaultMessage="This chart shows the average typing speed for each individual key."
          />
        </Figure.Description>
      </Explainer>

      <ChartWrapper>
        <KeySpeedHistogram
          keyStatsMap={keyStatsMap}
          width="100%"
          height="18rem"
        />
      </ChartWrapper>
    </Figure>
  );
}
