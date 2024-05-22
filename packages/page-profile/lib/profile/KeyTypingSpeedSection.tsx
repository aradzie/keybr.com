import { KeySpeedChart, Marker } from "@keybr/chart";
import { LessonKey, Target } from "@keybr/lesson";
import { KeyDetails, KeySelector } from "@keybr/lesson-ui";
import { hasData } from "@keybr/math";
import { type KeyStatsMap } from "@keybr/result";
import { useSettings } from "@keybr/settings";
import { Explainer, Figure, Para, styleTextCenter } from "@keybr/widget";
import { type ReactNode, useState } from "react";
import { FormattedMessage } from "react-intl";
import { SmoothnessRange } from "./SmoothnessRange.tsx";
import { ChartControls, ChartWrapper } from "./widgets.tsx";

export function KeyTypingSpeedSection({
  keyStatsMap,
}: {
  readonly keyStatsMap: KeyStatsMap;
}): ReactNode {
  const { settings } = useSettings();
  const { letters } = keyStatsMap;
  const [current, setCurrent] = useState(letters[0]);
  const [smoothness, setSmoothness] = useState(0.5);
  const target = new Target(settings);

  if (!letters.includes(current)) {
    setCurrent(letters[0]);
    return null;
  }

  const keyStats = keyStatsMap.get(current);
  const { samples } = keyStats;

  return (
    <Figure>
      <Figure.Caption>
        <FormattedMessage
          id="profile.chart.keySpeed.caption"
          defaultMessage="Key Typing Speed"
        />
      </Figure.Caption>

      <Explainer>
        <Figure.Description>
          <FormattedMessage
            id="profile.chart.keySpeed.description"
            defaultMessage="This chart shows the typing speed change for each individual key."
          />
        </Figure.Description>
      </Explainer>

      <Para className={styleTextCenter}>
        <KeySelector
          keyStatsMap={keyStatsMap}
          current={current}
          onSelect={(current) => {
            setCurrent(current);
          }}
        />
      </Para>

      <Para className={styleTextCenter}>
        <KeyDetails lessonKey={LessonKey.from(keyStats, target)} />
      </Para>

      <ChartWrapper>
        <KeySpeedChart
          samples={samples}
          smoothness={smoothness}
          width="100%"
          height="25rem"
        />
      </ChartWrapper>

      <ChartControls>
        <SmoothnessRange
          disabled={!hasData(samples)}
          value={smoothness}
          onChangeValue={(value) => {
            setSmoothness(value);
          }}
        />
      </ChartControls>

      <Figure.Legend>
        <FormattedMessage
          id="profile.chart.keySpeed.legend"
          defaultMessage="Horizontal axis: lesson number. Vertical axis: {label1} – typing speed for the currently selected key, {label2} – target typing speed."
          values={{
            label1: <Marker type="speed" />,
            label2: <Marker type="threshold" />,
          }}
        />
      </Figure.Legend>
    </Figure>
  );
}
