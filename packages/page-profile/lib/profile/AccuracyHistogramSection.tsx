import { AccuracyHistogram, makeAccuracyDistribution } from "@keybr/chart";
import { useIntlNumbers } from "@keybr/intl";
import { type SummaryStats } from "@keybr/result";
import {
  Explainer,
  Field,
  FieldList,
  Figure,
  Para,
  RadioBox,
  Value,
} from "@keybr/widget";
import React, { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ChartWrapper } from "./ChartWrapper.tsx";

export function AccuracyHistogramSection({ stats }: { stats: SummaryStats }) {
  const distribution = useMemo(() => makeAccuracyDistribution(), []);
  const { formatMessage } = useIntl();
  const { formatPercents } = useIntlNumbers();
  const [period, setPeriod] = useState("average");

  const value = period === "top" ? stats.accuracy.max : stats.accuracy.avg;
  const cdf = distribution.cdf(distribution.scale(value));

  return (
    <Figure>
      <Figure.Caption>
        <FormattedMessage
          id="profile.chart.histogram.accuracy.caption"
          defaultMessage="Relative Accuracy"
        />
      </Figure.Caption>

      <Explainer>
        <Figure.Description>
          <FormattedMessage
            id="profile.chart.histogram.accuracy.description"
            defaultMessage="This is a histogram of the accuracies of all users, and your position in relation to them."
          />
        </Figure.Description>
      </Explainer>

      <Para align="center">
        {period === "average" ? (
          <FormattedMessage
            id="profile.chart.compareAverageAccuracy.description"
            defaultMessage="Your all time average accuracy beats {value} of all other people."
            values={{
              value: <Value value={value > 0 ? formatPercents(cdf) : "N/A"} />,
            }}
          />
        ) : (
          <FormattedMessage
            id="profile.chart.compareTopAccuracy.description"
            defaultMessage="Your all time top accuracy beats {value} of all other people."
            values={{
              value: <Value value={value > 0 ? formatPercents(cdf) : "N/A"} />,
            }}
          />
        )}
      </Para>

      <ChartWrapper>
        <AccuracyHistogram
          distribution={distribution}
          thresholds={[
            period === "average"
              ? {
                  label: formatMessage({
                    id: "metric.averageAccuracy.name",
                    defaultMessage: "Average accuracy",
                  }),
                  value,
                }
              : {
                  label: formatMessage({
                    id: "metric.topAccuracy.name",
                    defaultMessage: "Top accuracy",
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
            value="average"
            checked={period === "average"}
            label="Average Accuracy"
            onSelect={() => {
              setPeriod("average");
            }}
          />
        </Field>
        <Field>
          <RadioBox
            name="period"
            value="top"
            checked={period === "top"}
            label="Top Accuracy"
            onSelect={() => {
              setPeriod("top");
            }}
          />
        </Field>
        <Field.Filler />
      </FieldList>

      <Explainer>
        <Figure.Legend>
          <FormattedMessage
            id="profile.chart.histogram.accuracy.legend"
            defaultMessage="See how accurate you type relative to other users. The higher the bar is, the more people type at that accuracy. Your position is marked with the colored vertical lines."
          />
        </Figure.Legend>
      </Explainer>
    </Figure>
  );
}
