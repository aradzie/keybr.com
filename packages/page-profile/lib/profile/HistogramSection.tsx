import { DistributionChart } from "@keybr/chart";
import { type Distribution } from "@keybr/math";
import { type Result } from "@keybr/result";
import { Figure } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { ChartWrapper } from "./widgets.tsx";

export function HistogramSection({
  results,
  distribution,
}: {
  readonly results: readonly Result[];
  readonly distribution: Distribution;
}): ReactNode {
  return (
    <Figure>
      <Figure.Caption>
        <FormattedMessage
          id="profile.chart.histogram.caption"
          description="Header text."
          defaultMessage="Relative Typing Speed"
        />
      </Figure.Caption>

      <Figure.Description>
        <FormattedMessage
          id="profile.chart.histogram.description"
          description="Message text."
          defaultMessage="This is a histogram of the typing speeds of all users, and your position in relation to them."
        />
      </Figure.Description>

      <ChartWrapper>
        <DistributionChart
          results={results}
          distribution={distribution}
          width="100%"
          height="25rem"
        />
      </ChartWrapper>

      <Figure.Legend>
        <FormattedMessage
          id="profile.chart.histogram.legend"
          description="Message text."
          defaultMessage="See how fast you type relative to other users. The higher the bar is, the more people type at that speed. Your position is marked with the colored vertical lines."
        />
      </Figure.Legend>
    </Figure>
  );
}
