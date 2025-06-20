import { Marker, PLOT_MASK, SpeedChart } from "@keybr/chart";
import { hasData } from "@keybr/math";
import { type Result } from "@keybr/result";
import { Explainer, Figure } from "@keybr/widget";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { ChartWrapper } from "./ChartWrapper.tsx";
import { SmoothnessRange } from "./SmoothnessRange.tsx";

export function SpeedChartSection({ results }: { results: readonly Result[] }) {
  const [smoothness, setSmoothness] = useState(0.5);
  const [plotsVisible, setPlotsVisible] = useState(0b111);

  const toggleSpeedPlot = () => {
    setPlotsVisible(plotsVisible ^ PLOT_MASK.speed);
  };

  const toggleAccuracyPlot = () => {
    setPlotsVisible(plotsVisible ^ PLOT_MASK.accuracy);
  };

  const toggleComplexityPlot = () => {
    setPlotsVisible(plotsVisible ^ PLOT_MASK.complexity);
  };

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
          plotsVisible={plotsVisible}
        />
      </ChartWrapper>

      <SmoothnessRange
        disabled={!hasData(results)}
        value={smoothness}
        onChange={setSmoothness}
      />

      <Figure.Legend>
        <FormattedMessage
          id="profile.chart.speed.legend"
          defaultMessage="Horizontal axis: lesson number. Vertical axis: {label1} – typing speed, {label2} – typing accuracy, {label3} – number of keys in the lessons."
          values={{
            label1: <Marker type="speed" onClick={toggleSpeedPlot} />,
            label2: <Marker type="accuracy" onClick={toggleAccuracyPlot} />,
            label3: <Marker type="complexity" onClick={toggleComplexityPlot} />,
          }}
        />
      </Figure.Legend>
    </Figure>
  );
}
