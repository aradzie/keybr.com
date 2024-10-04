import { Tab, TabList } from "@keybr/widget";
import React, { type ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import { AccuracyHistogramSection } from "./AccuracyHistogramSection.tsx";
import { type ResultSummary } from "./resultsummary.ts";
import { SpeedHistogramSection } from "./SpeedHistogramSection.tsx";

export function HistogramsSection({
  summary,
}: {
  readonly summary: ResultSummary;
}): ReactNode {
  const { formatMessage } = useIntl();
  const [index, setIndex] = useState(0);
  return (
    <TabList selectedIndex={index} onSelect={setIndex}>
      <Tab
        label={formatMessage({
          id: "profile.chart.histogram.caption",
          defaultMessage: "Relative Typing Speed",
        })}
      >
        <SpeedHistogramSection summary={summary} />
      </Tab>
      <Tab
        label={formatMessage({
          id: "profile.chart.histogram.accuracy.caption",
          defaultMessage: "Relative Accuracy",
        })}
      >
        <AccuracyHistogramSection summary={summary} />
      </Tab>
    </TabList>
  );
}
