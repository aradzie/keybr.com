import { useIntlNumbers } from "@keybr/intl";
import { type Distribution } from "@keybr/math";
import { type ResultSummary } from "@keybr/result";
import { Header, Para, Value } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function ComparisonSection({
  summary,
  distribution,
}: {
  readonly summary: ResultSummary;
  readonly distribution: Distribution;
}): ReactNode {
  const { formatPercents } = useIntlNumbers();

  let topProb = NaN;
  let avgProb = NaN;
  const { results, stats } = summary.allTimeStats;
  if (results.length > 0) {
    topProb = distribution.cdf(stats.speed.max);
    avgProb = distribution.cdf(stats.speed.avg);
  }

  return (
    <>
      <Header level={2}>
        <FormattedMessage
          id="profile.chart.compare.description"
          description="Header text."
          defaultMessage="Compare Yourself"
        />
      </Header>

      <Para>
        <FormattedMessage
          id="profile.chart.compareTopSpeed.description"
          description="Message text."
          defaultMessage="Your all time top speed beats {value} of all other people."
          values={{
            value: (
              <Value value={topProb > 0 ? formatPercents(topProb) : "N/A"} />
            ),
          }}
        />
      </Para>

      <Para>
        <FormattedMessage
          id="profile.chart.compareAverageSpeed.description"
          description="Message text."
          defaultMessage="Your all time average speed beats {value} of all other people."
          values={{
            value: (
              <Value value={avgProb > 0 ? formatPercents(avgProb) : "N/A"} />
            ),
          }}
        />
      </Para>
    </>
  );
}
