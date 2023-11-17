import { DistributionChart } from "@keybr/chart";
import { type Distribution } from "@keybr/math";
import { Figure } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { type Summary } from "./Summary.tsx";
import { ChartWrapper } from "./widgets.tsx";

export function DistributionSection({
  distribution,
  summary,
}: {
  readonly distribution: Distribution;
  readonly summary: Summary;
}): ReactNode {
  const { formatMessage } = useIntl();

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
          distribution={distribution}
          thresholds={[
            {
              label: formatMessage({
                id: "metric.averageSpeed.name",
                description: "Widget name.",
                defaultMessage: "Average speed",
              }),
              value: summary.stats.speed.avg,
            },
            {
              label: formatMessage({
                id: "metric.bestSpeed.name",
                description: "Widget name.",
                defaultMessage: "Best speed",
              }),
              value: summary.stats.speed.max,
            },
          ]}
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
