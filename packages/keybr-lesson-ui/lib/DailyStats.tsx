import { useIntlNumbers } from "@keybr/intl";
import { type DailyStats as DailyStatsType } from "@keybr/result";
import { formatDuration, Name, NameValue, Para, Value } from "@keybr/widget";
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
  const { formatDate, formatMessage } = useIntl();
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
        <NameValue
          name={formatMessage({
            id: "metric.topSpeed.name",
            defaultMessage: "Top speed",
          })}
          value={formatSpeed(stats.speed.max)}
        />
      </div>
      <div>
        <NameValue
          name={formatMessage({
            id: "metric.averageSpeed.name",
            defaultMessage: "Average speed",
          })}
          value={formatSpeed(stats.speed.avg)}
        />
      </div>
      <div>
        <NameValue
          name={formatMessage({
            id: "metric.averageAccuracy.name",
            defaultMessage: "Average accuracy",
          })}
          value={formatPercents(stats.accuracy.avg)}
        />
      </div>
    </div>
  );
}
