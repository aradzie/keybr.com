import { DistributionChart } from "@keybr/chart";
import { type Distribution } from "@keybr/math";
import { type ResultSummary } from "@keybr/result";
import { Figure } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ChartWrapper } from "./widgets.tsx";

export function DistributionSection({
  summary,
  distribution,
}: {
  readonly summary: ResultSummary;
  readonly distribution: Distribution;
}): ReactNode {
  const { formatMessage } = useIntl();

  const { speed } = summary.allTimeStats.stats;

  return (
    <Figure>
      <Figure.Caption>
        <FormattedMessage
          id="profile.chart.histogram.caption"
          defaultMessage="Relative Typing Speed"
        />
      </Figure.Caption>

      <Figure.Description>
        <FormattedMessage
          id="profile.chart.histogram.description"
          defaultMessage="This is a histogram of the typing speeds of all users, and your position in relation to them."
        />
      </Figure.Description>

      <ChartWrapper>
        <DistributionChart
          distribution={distribution}
          thresholds={[
            {
              label: formatMessage({
                id: "metric.averageSpeed.name",
                defaultMessage: "Average speed",
              }),
              value: speed.avg,
            },
            {
              label: formatMessage({
                id: "metric.bestSpeed.name",
                defaultMessage: "Best speed",
              }),
              value: speed.max,
            },
          ]}
          width="100%"
          height="25rem"
        />
      </ChartWrapper>

      <Figure.Legend>
        <FormattedMessage
          id="profile.chart.histogram.legend"
          defaultMessage="See how fast you type relative to other users. The higher the bar is, the more people type at that speed. Your position is marked with the colored vertical lines."
        />
      </Figure.Legend>
    </Figure>
  );
}
