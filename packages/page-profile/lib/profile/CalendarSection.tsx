import { Explainer, Figure } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { Calendar } from "./Calendar.tsx";
import { type ResultSummary } from "./resultsummary.ts";

export function CalendarSection({
  summary,
}: {
  readonly summary: ResultSummary;
}): ReactNode {
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

      <Calendar summary={summary} />
    </Figure>
  );
}
