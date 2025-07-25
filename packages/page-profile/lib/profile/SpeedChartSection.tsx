import type { PlotMask } from "@keybr/chart";
import { Marker, PLOT_MASK, SpeedChart } from "@keybr/chart";
import { hasData } from "@keybr/math";
import { type Result } from "@keybr/result";
import { Explainer, Figure } from "@keybr/widget";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ChartWrapper } from "./ChartWrapper.tsx";
import { SmoothnessRange } from "./SmoothnessRange.tsx";

export function SpeedChartSection({ results }: { results: readonly Result[] }) {
  const [smoothness, setSmoothness] = useState(0.5);

  const initialPlotsVisible = PLOT_MASK.all;

  const [soloedPlots, setSoloedPlots] = useState(initialPlotsVisible);
  const [toggledPlots, setToggledPlots] = useState(initialPlotsVisible);

  const plotsVisible = useMemo(() => {
    return soloedPlots & toggledPlots;
  }, [toggledPlots, soloedPlots]);

  const soloPlot = (plotMask: PlotMask) => {
    return () => {
      setSoloedPlots(plotMask);
    };
  };

  const togglePlot = (plotMask: PlotMask) => {
    return () => {
      setToggledPlots(toggledPlots ^ plotMask);
    };
  };

  const resetSoloedPlots = () => {
    setSoloedPlots(initialPlotsVisible);
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
            label1: (
              <Marker
                type="speed"
                onClick={togglePlot(PLOT_MASK.speed)}
                onMouseEnter={soloPlot(PLOT_MASK.speed)}
                onMouseLeave={resetSoloedPlots}
              />
            ),
            label2: (
              <Marker
                type="accuracy"
                onClick={togglePlot(PLOT_MASK.accuracy)}
                onMouseEnter={soloPlot(PLOT_MASK.accuracy)}
                onMouseLeave={resetSoloedPlots}
              />
            ),
            label3: (
              <Marker
                type="complexity"
                onClick={togglePlot(PLOT_MASK.complexity)}
                onMouseEnter={soloPlot(PLOT_MASK.complexity)}
                onMouseLeave={resetSoloedPlots}
              />
            ),
          }}
        />
      </Figure.Legend>
    </Figure>
  );
}
