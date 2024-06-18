import { DistributionChart } from "@keybr/chart";
import { useIntlNumbers } from "@keybr/intl";
import { type Distribution } from "@keybr/math";
import {
  Explainer,
  Field,
  FieldList,
  Figure,
  Para,
  RadioBox,
  styleTextCenter,
  Value,
} from "@keybr/widget";
import React, { type ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { type ResultSummary } from "./resultsummary.ts";
import { ChartWrapper } from "./widgets.tsx";

export function DistributionSection({
  summary,
  distribution,
}: {
  readonly summary: ResultSummary;
  readonly distribution: Distribution;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatPercents } = useIntlNumbers();
  const [period, setPeriod] = useState("top");

  const value =
    period === "top"
      ? summary.allTimeStats.stats.speed.max
      : summary.allTimeStats.stats.speed.avg;
  const cdf = distribution.cdf(value);

  return (
    <Figure>
      <Figure.Caption>
        <FormattedMessage
          id="profile.chart.histogram.caption"
          defaultMessage="Relative Typing Speed"
        />
      </Figure.Caption>

      <Explainer>
        <Figure.Description>
          <FormattedMessage
            id="profile.chart.histogram.description"
            defaultMessage="This is a histogram of the typing speeds of all users, and your position in relation to them."
          />
        </Figure.Description>
      </Explainer>

      <Para className={styleTextCenter}>
        {period === "average" ? (
          <FormattedMessage
            id="profile.chart.compareAverageSpeed.description"
            defaultMessage="Your all time average speed beats {value} of all other people."
            values={{
              value: <Value value={value > 0 ? formatPercents(cdf) : "N/A"} />,
            }}
          />
        ) : (
          <FormattedMessage
            id="profile.chart.compareTopSpeed.description"
            defaultMessage="Your all time top speed beats {value} of all other people."
            values={{
              value: <Value value={value > 0 ? formatPercents(cdf) : "N/A"} />,
            }}
          />
        )}
      </Para>

      <ChartWrapper>
        <DistributionChart
          distribution={distribution}
          thresholds={[
            period === "average"
              ? {
                  label: formatMessage({
                    id: "metric.averageSpeed.name",
                    defaultMessage: "Average speed",
                  }),
                  value,
                }
              : {
                  label: formatMessage({
                    id: "metric.topSpeed.name",
                    defaultMessage: "Top speed",
                  }),
                  value,
                },
          ]}
          width="100%"
          height="25rem"
        />
      </ChartWrapper>

      <FieldList>
        <Field.Filler />
        <Field>
          <RadioBox
            name="period"
            value="top"
            checked={period === "top"}
            label="Top Speed"
            onSelect={() => {
              setPeriod("top");
            }}
          />
        </Field>
        <Field>
          <RadioBox
            name="period"
            value="average"
            checked={period === "average"}
            label="Average Speed"
            onSelect={() => {
              setPeriod("average");
            }}
          />
        </Field>
        <Field.Filler />
      </FieldList>

      <Explainer>
        <Figure.Legend>
          <FormattedMessage
            id="profile.chart.histogram.legend"
            defaultMessage="See how fast you type relative to other users. The higher the bar is, the more people type at that speed. Your position is marked with the colored vertical lines."
          />
        </Figure.Legend>
      </Explainer>
    </Figure>
  );
}
