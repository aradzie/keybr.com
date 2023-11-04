import { useIntlNumbers } from "@keybr/intl";
import { useFormatter } from "@keybr/lesson-ui";
import { type Distribution } from "@keybr/math";
import {
  LocalDate,
  newSummaryStats,
  type Result,
  ResultGroups,
  type SummaryStats,
} from "@keybr/result";
import { formatDuration, Header, Para } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as styles from "./Summary.module.less";

export type Summary = {
  readonly today: LocalDate;
  readonly results: readonly Result[];
  readonly resultsByDate: ResultGroups<LocalDate>;
  readonly resultsToday: readonly Result[];
  readonly stats: SummaryStats;
  readonly statsToday: SummaryStats;
  readonly topProb: number;
  readonly avgProb: number;
  readonly topProbToday: number;
  readonly avgProbToday: number;
};

export function useSummary(
  results: readonly Result[],
  distribution: Distribution,
): Summary {
  const today = LocalDate.now();
  const resultsByDate = ResultGroups.byDate(results);
  const resultsToday = resultsByDate.get(today);
  const stats = newSummaryStats(results);
  const statsToday = newSummaryStats(resultsToday);
  let topProb = NaN;
  let avgProb = NaN;
  if (results.length > 0) {
    topProb = distribution.cdf(stats.speed.max);
    avgProb = distribution.cdf(stats.speed.avg);
  }
  let topProbToday = NaN;
  let avgProbToday = NaN;
  if (resultsToday.length > 0) {
    topProbToday = distribution.cdf(statsToday.speed.max);
    avgProbToday = distribution.cdf(statsToday.speed.avg);
  }
  return {
    today,
    results,
    resultsByDate,
    resultsToday,
    stats,
    statsToday,
    topProb,
    avgProb,
    topProbToday,
    avgProbToday,
  };
}

export function AllTimeSummary({
  summary,
}: {
  readonly summary: Summary;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatNumber } = useIntlNumbers();
  const { formatSpeed, speedUnit, speedUnitName } = useFormatter();

  const {
    stats: { count, time, speed },
  } = summary;

  return (
    <>
      <Header level={2}>
        <FormattedMessage
          id="profile.overview.statisticsAllTime"
          description="Header."
          defaultMessage="All Time Statistics:"
        />
      </Header>

      <Para className={styles.statisticList}>
        <Statistic
          name={formatMessage({
            id: "profile.overview.totalTimeLabel",
            description: "Gauge label.",
            defaultMessage: "Total Time",
          })}
          value={formatDuration(time)}
          title={formatMessage({
            id: "profile.overview.totalTimeTitle",
            description: "Gauge title.",
            defaultMessage: "Time spent on exercises.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "profile.overview.totalLessonsLabel",
            description: "Gauge label.",
            defaultMessage: "Total Lessons",
          })}
          value={formatNumber(count)}
          title={formatMessage({
            id: "profile.overview.totalLessonsTitle",
            description: "Gauge title.",
            defaultMessage: "Number of lessons completed.",
          })}
        />

        <Statistic
          name={formatMessage(
            {
              id: "profile.overview.topSpeedLabel",
              description: "Gauge label.",
              defaultMessage: "Top Speed ({speedUnit})",
            },
            { speedUnit: speedUnit.id },
          )}
          value={
            speed.max > 0 ? formatSpeed(speed.max, { unit: false }) : "N/A"
          }
          title={formatMessage(
            {
              id: "profile.overview.topSpeedTitle",
              description: "Gauge title.",
              defaultMessage: "Top typing speed ({speedUnitName}).",
            },
            { speedUnitName },
          )}
        />

        <Statistic
          name={formatMessage(
            {
              id: "profile.overview.averageSpeedLabel",
              description: "Gauge label.",
              defaultMessage: "Average Speed ({speedUnit})",
            },
            { speedUnit: speedUnit.id },
          )}
          value={
            speed.avg > 0 ? formatSpeed(speed.avg, { unit: false }) : "N/A"
          }
          title={formatMessage(
            {
              id: "profile.overview.averageSpeedTitle",
              description: "Gauge title.",
              defaultMessage: "Average typing speed ({speedUnitName}).",
            },
            { speedUnitName },
          )}
        />
      </Para>
    </>
  );
}

export function TodaySummary({
  summary,
}: {
  readonly summary: Summary;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatNumber } = useIntlNumbers();
  const { formatSpeed, speedUnit, speedUnitName } = useFormatter();

  const {
    statsToday: { count, time, speed },
  } = summary;

  return (
    <>
      <Header level={2}>
        <FormattedMessage
          id="profile.overview.statisticsToday"
          description="Section header."
          defaultMessage="Statistics for Today:"
        />
      </Header>

      <Para className={styles.statisticList}>
        <Statistic
          name={formatMessage({
            id: "profile.overview.totalTimeTodayLabel",
            description: "Gauge label.",
            defaultMessage: "Total Time",
          })}
          value={formatDuration(time)}
          title={formatMessage({
            id: "profile.overview.totalTimeTodayTitle",
            description: "Gauge title.",
            defaultMessage: "Time spent on exercises today.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "profile.overview.totalLessonsTodayLabel",
            description: "Gauge label.",
            defaultMessage: "Total Lessons",
          })}
          value={formatNumber(count)}
          title={formatMessage({
            id: "profile.overview.totalLessonsTodayTitle",
            description: "Gauge title.",
            defaultMessage: "Number of lessons completed today.",
          })}
        />

        <Statistic
          name={formatMessage(
            {
              id: "profile.overview.topSpeedTodayLabel",
              description: "Gauge label.",
              defaultMessage: "Top Speed ({speedUnit})",
            },
            { speedUnit: speedUnit.id },
          )}
          value={
            speed.max > 0 ? formatSpeed(speed.max, { unit: false }) : "N/A"
          }
          title={formatMessage(
            {
              id: "profile.overview.topSpeedTodayTitle",
              description: "Gauge title.",
              defaultMessage: "Top typing speed today ({speedUnitName}).",
            },
            { speedUnitName },
          )}
        />

        <Statistic
          name={formatMessage(
            {
              id: "profile.overview.averageSpeedTodayLabel",
              description: "Gauge label.",
              defaultMessage: "Average Speed ({speedUnit})",
            },
            { speedUnit: speedUnit.id },
          )}
          value={
            speed.avg > 0 ? formatSpeed(speed.avg, { unit: false }) : "N/A"
          }
          title={formatMessage(
            {
              id: "profile.overview.averageSpeedTodayTitle",
              description: "Gauge title.",
              defaultMessage: "Average typing speed today ({speedUnitName}).",
            },
            { speedUnitName },
          )}
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
