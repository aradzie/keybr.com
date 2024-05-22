import { Marker, SpeedChart } from "@keybr/chart";
import { hasData } from "@keybr/math";
import { type Result } from "@keybr/result";
import { Explainer, Figure } from "@keybr/widget";
import { type ReactNode, useState } from "react";
import { FormattedMessage } from "react-intl";
import { SmoothnessRange } from "./SmoothnessRange.tsx";
import { ChartControls, ChartWrapper } from "./widgets.tsx";

export function TypingSpeedSection({
  results,
}: {
  readonly results: readonly Result[];
}): ReactNode {
  const [smoothness, setSmoothness] = useState(0.5);

  return (
    <Figure>
      <Figure.Caption>
        <FormattedMessage
          id="profile.chart.speed.caption"
          defaultMessage="Typing Speed"
        />
      </Figure.Caption>

      <Explainer>
        <Figure.Description>
          <FormattedMessage
            id="profile.chart.speed.description"
            defaultMessage="This chart shows how overall typing speed changes over time."
          />
        </Figure.Description>
      </Explainer>

      <ChartWrapper>
        <SpeedChart
          results={results}
          smoothness={smoothness}
          width="100%"
          height="25rem"
        />
      </ChartWrapper>

      <ChartControls>
        <SmoothnessRange
          disabled={!hasData(results)}
          value={smoothness}
          onChangeValue={(value) => {
            setSmoothness(value);
          }}
        />
      </ChartControls>

      <Figure.Legend>
        <FormattedMessage
          id="profile.chart.speed.legend"
          defaultMessage="Horizontal axis: lesson number. Vertical axis: {label1} – typing speed, {label2} – typing accuracy, {label3} – number of keys in the lessons."
          values={{
            label1: <Marker type="speed" />,
            label2: <Marker type="accuracy" />,
            label3: <Marker type="complexity" />,
          }}
        />
      </Figure.Legend>
    </Figure>
  );
}
