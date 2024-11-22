import { useIntlNumbers } from "@keybr/intl";
import { type DailyStats as DailyStatsType } from "@keybr/result";
import { formatDuration, Name, Para, Value } from "@keybr/widget";
import { FormattedMessage, useIntl } from "react-intl";
import * as styles from "./DailyStats.module.less";
import { type Effort } from "./effort.ts";
import { useFormatter } from "./format.ts";

export function DailyStats({
  stats: { date, results, stats },
  effort,
}: {
  stats: DailyStatsType;
  effort: Effort;
}) {
  const { formatDate } = useIntl();
  const { formatNumber, formatPercents } = useIntlNumbers();
  const { formatSpeed } = useFormatter();
  return (
    <div className={styles.root}>
      <Para align="center">
        {formatDate(Number(date), { dateStyle: "long" })}
      </Para>
      <div>
        <Name>
          <FormattedMessage
            id="profile.calendar.dailyGoal.description"
            defaultMessage="Daily goal: {value}"
            values={{
              value: <Value>{formatPercents(effort.effort(stats.time))}</Value>,
            }}
          />
        </Name>
      </div>
      <div>
        <Name>
          <FormattedMessage
            id="profile.calendar.totalTime.description"
            defaultMessage="Time of lessons: {value}"
            values={{
              value: <Value>{formatDuration(stats.time)}</Value>,
            }}
          />
        </Name>
      </div>
      <div>
        <Name>
          <FormattedMessage
            id="profile.calendar.totalLessons.description"
            defaultMessage="Number of lessons: {value}"
            values={{
              value: <Value>{formatNumber(results.length)}</Value>,
            }}
          />
        </Name>
      </div>
      <div>
        <Name>
          <FormattedMessage
            id="profile.calendar.topSpeed.description"
            defaultMessage="Top speed: {value}"
            values={{
              value: <Value>{formatSpeed(stats.speed.max)}</Value>,
            }}
          />
        </Name>
      </div>
      <div>
        <Name>
          <FormattedMessage
            id="profile.calendar.averageSpeed.description"
            defaultMessage="Average speed: {value}"
            values={{
              value: <Value>{formatSpeed(stats.speed.avg)}</Value>,
            }}
          />
        </Name>
      </div>
    </div>
  );
}
