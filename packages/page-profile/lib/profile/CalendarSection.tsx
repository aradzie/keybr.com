import { Calendar, EffortLegend, useEffort } from "@keybr/lesson-ui";
import { type ResultSummary } from "@keybr/result";
import { Explainer, Figure } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function CalendarSection({
  summary,
}: {
  readonly summary: ResultSummary;
}): ReactNode {
  const effort = useEffort();

  return (
    <Figure>
      <Figure.Caption>
        <FormattedMessage
          id="profile.chart.calendar.caption"
          defaultMessage="Practice Calendar"
        />
      </Figure.Caption>

      <Explainer>
        <Figure.Description>
          <FormattedMessage
            id="profile.chart.calendar.description"
            defaultMessage="This calendar shows the dates of active learning."
          />
        </Figure.Description>
      </Explainer>

      <Calendar summary={summary} effort={effort} />

      <Figure.Legend>
        <EffortLegend effort={effort} />
      </Figure.Legend>
    </Figure>
  );
}
