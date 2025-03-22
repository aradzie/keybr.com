import { useIntlNumbers } from "@keybr/intl";
import { type DailyStats as DailyStatsType } from "@keybr/result";
import { formatDuration, NameValue, Para } from "@keybr/widget";
import { useIntl } from "react-intl";
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
        <NameValue
          name={formatMessage({
            id: "t_Daily_goal",
            defaultMessage: "Daily goal",
          })}
          value={formatPercents(effort.effort(stats.time))}
        />
      </div>
      <div>
        <NameValue
          name={formatMessage({
            id: "t_Time",
            defaultMessage: "Time",
          })}
          value={formatDuration(stats.time)}
        />
      </div>
      <div>
        <NameValue
          name={formatMessage({
            id: "t_num_Lessons",
            defaultMessage: "Lessons",
          })}
          value={formatNumber(results.length)}
        />
      </div>
      <div>
        <NameValue
          name={formatMessage({
            id: "t_Top_speed",
            defaultMessage: "Top speed",
          })}
          value={formatSpeed(stats.speed.max)}
        />
      </div>
      <div>
        <NameValue
          name={formatMessage({
            id: "t_Average_speed",
            defaultMessage: "Average speed",
          })}
          value={formatSpeed(stats.speed.avg)}
        />
      </div>
      <div>
        <NameValue
          name={formatMessage({
            id: "t_Average_accuracy",
            defaultMessage: "Average accuracy",
          })}
          value={formatPercents(stats.accuracy.avg)}
        />
      </div>
    </div>
  );
}
