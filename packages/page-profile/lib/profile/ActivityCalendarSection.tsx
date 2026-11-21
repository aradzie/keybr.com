import { ActivityCalendar, EffortLegend, useEffort } from "@keybr/lesson-ui";
import { type DailyStatsMap } from "@keybr/result";
import { Explainer, Figure } from "@keybr/widget";
import { FormattedMessage } from "react-intl";

export function ActivityCalendarSection({
  dailyStatsMap,
}: {
  dailyStatsMap: DailyStatsMap;
}) {
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

      <ActivityCalendar dailyStatsMap={dailyStatsMap} effort={effort} />

      <Figure.Legend>
        <EffortLegend effort={effort} />
      </Figure.Legend>
    </Figure>
  );
}
