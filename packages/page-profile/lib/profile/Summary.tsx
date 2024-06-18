import { useIntlNumbers } from "@keybr/intl";
import { useFormatter } from "@keybr/lesson-ui";
import { formatDuration, Header, Para } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { type ResultSummary } from "./resultsummary.ts";
import * as styles from "./Summary.module.less";

export function AllTimeSummary({
  summary,
}: {
  readonly summary: ResultSummary;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatNumber, formatPercents } = useIntlNumbers();
  const { formatSpeed } = useFormatter();

  const { count, time, speed, accuracy } = summary.allTimeStats.stats;

  return (
    <>
      <Header level={2}>
        <FormattedMessage
          id="profile.chart.summary.statisticsAllTime.header"
          defaultMessage="All Time Statistics"
        />
      </Header>

      <Para className={styles.statisticList}>
        <Statistic
          name={formatMessage({
            id: "metric.summary.totalTime.label",
            defaultMessage: "Time",
          })}
          value={formatDuration(time)}
          title={formatMessage({
            id: "metric.summary.totalTime.description",
            defaultMessage: "Time spent on exercises.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "metric.summary.lessonCount.label",
            defaultMessage: "Lessons",
          })}
          value={formatNumber(count)}
          title={formatMessage({
            id: "metric.summary.lessonCount.description",
            defaultMessage: "The number of lessons completed.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "metric.summary.topSpeed.label",
            defaultMessage: "Top Speed",
          })}
          value={speed.max > 0 ? formatSpeed(speed.max) : "N/A"}
          title={formatMessage({
            id: "metric.summary.topSpeed.description",
            defaultMessage: "Top typing speed.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "metric.summary.averageSpeed.label",
            defaultMessage: "Average Speed",
          })}
          value={speed.avg > 0 ? formatSpeed(speed.avg) : "N/A"}
          title={formatMessage({
            id: "metric.summary.averageSpeed.description",
            defaultMessage: "Average typing speed.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "metric.summary.topAccuracy.label",
            defaultMessage: "Top Accuracy",
          })}
          value={accuracy.max > 0 ? formatPercents(accuracy.max) : "N/A"}
          title={formatMessage({
            id: "metric.summary.topAccuracy.description",
            defaultMessage: "Top typing accuracy.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "metric.summary.averageAccuracy.label",
            defaultMessage: "Average Accuracy",
          })}
          value={accuracy.avg > 0 ? formatPercents(accuracy.avg) : "N/A"}
          title={formatMessage({
            id: "metric.summary.averageAccuracy.description",
            defaultMessage: "Average typing accuracy.",
          })}
        />
      </Para>
    </>
  );
}

export function TodaySummary({
  summary,
}: {
  readonly summary: ResultSummary;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatNumber, formatPercents } = useIntlNumbers();
  const { formatSpeed } = useFormatter();

  const { count, time, speed, accuracy } = summary.todayStats.stats;

  return (
    <>
      <Header level={2}>
        <FormattedMessage
          id="profile.chart.summary.statisticsToday.header"
          defaultMessage="Statistics for Today"
        />
      </Header>

      <Para className={styles.statisticList}>
        <Statistic
          name={formatMessage({
            id: "metric.summary.totalTimeToday.label",
            defaultMessage: "Time",
          })}
          value={formatDuration(time)}
          title={formatMessage({
            id: "metric.summary.totalTimeToday.description",
            defaultMessage: "Time spent on exercises today.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "metric.summary.lessonCountToday.label",
            defaultMessage: "Lessons",
          })}
          value={formatNumber(count)}
          title={formatMessage({
            id: "metric.summary.lessonCountToday.description",
            defaultMessage: "The number of lessons completed today.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "metric.summary.topSpeedToday.label",
            defaultMessage: "Top Speed",
          })}
          value={speed.max > 0 ? formatSpeed(speed.max) : "N/A"}
          title={formatMessage({
            id: "metric.summary.topSpeedToday.description",
            defaultMessage: "Top typing speed today.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "metric.summary.averageSpeedToday.label",
            defaultMessage: "Average Speed",
          })}
          value={speed.avg > 0 ? formatSpeed(speed.avg) : "N/A"}
          title={formatMessage({
            id: "metric.summary.averageSpeedToday.description",
            defaultMessage: "Average typing speed today.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "metric.summary.topAccuracyToday.label",
            defaultMessage: "Top Accuracy",
          })}
          value={accuracy.max > 0 ? formatPercents(accuracy.max) : "N/A"}
          title={formatMessage({
            id: "metric.summary.topAccuracyToday.description",
            defaultMessage: "Top typing accuracy today.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "metric.summary.averageAccuracyToday.label",
            defaultMessage: "Average Accuracy",
          })}
          value={accuracy.avg > 0 ? formatPercents(accuracy.avg) : "N/A"}
          title={formatMessage({
            id: "metric.summary.averageAccuracyToday.description",
            defaultMessage: "Average typing accuracy today.",
          })}
        />
      </Para>
    </>
  );
}

function Statistic({
  name,
  value,
  title,
}: {
  readonly name: unknown;
  readonly value: unknown;
  readonly title: string;
}): ReactNode {
  return (
    <span className={styles.statisticListItem} title={title}>
      <span className={styles.itemName}>{String(name) + ":"}</span>
      <span className={styles.itemValue}>{String(value)}</span>
    </span>
  );
}
