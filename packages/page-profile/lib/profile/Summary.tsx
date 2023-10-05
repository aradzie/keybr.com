import { useIntlNumbers } from "@keybr/intl";
import { useFormatter } from "@keybr/lesson-ui";
import { type Distribution } from "@keybr/math";
import {
  LocalDate,
  newSummaryStats,
  type Result,
  ResultGroups,
} from "@keybr/result";
import { formatDuration, Header, Para } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as styles from "./Summary.module.less";

export type Summary = {
  readonly today: LocalDate;
  readonly resultsByDate: ResultGroups<LocalDate>;
  readonly resultsToday: readonly Result[];
  readonly totalTime: string;
  readonly totalLessons: string;
  readonly topSpeed: string;
  readonly avgSpeed: string;
  readonly totalTimeToday: string;
  readonly totalLessonsToday: string;
  readonly topSpeedToday: string;
  readonly avgSpeedToday: string;
  readonly topProb: string;
  readonly avgProb: string;
  readonly topProbToday: string;
  readonly avgProbToday: string;
};

export function useSummary(
  results: readonly Result[],
  distribution: Distribution,
): Summary {
  const { formatNumber, formatPercents } = useIntlNumbers();
  const { formatSpeed } = useFormatter();

  const today = LocalDate.now();
  const resultsByDate = ResultGroups.byDate(results);
  const resultsToday = resultsByDate.get(today);

  let totalTime = formatDuration(0);
  let totalLessons = "0";
  let topSpeed = "N/A";
  let avgSpeed = "N/A";
  let totalTimeToday = formatDuration(0);
  let totalLessonsToday = "0";
  let topSpeedToday = "N/A";
  let avgSpeedToday = "N/A";
  let topProb = "N/A";
  let avgProb = "N/A";
  let topProbToday = "N/A";
  let avgProbToday = "N/A";

  if (results.length > 0) {
    const stats = newSummaryStats(results);

    totalTime = formatDuration(stats.totalTime);
    totalLessons = formatNumber(results.length);
    topSpeed = formatSpeed(stats.speed.max, { unit: false });
    avgSpeed = formatSpeed(stats.speed.avg, { unit: false });
    topProb = formatPercents(distribution.cdf(stats.speed.max));
    avgProb = formatPercents(distribution.cdf(stats.speed.avg));

    if (resultsToday.length > 0) {
      const statsToday = newSummaryStats(resultsToday);

      totalTimeToday = formatDuration(statsToday.totalTime);
      totalLessonsToday = formatNumber(resultsToday.length);
      topSpeedToday = formatSpeed(statsToday.speed.max, { unit: false });
      avgSpeedToday = formatSpeed(statsToday.speed.avg, { unit: false });
      topProbToday = formatPercents(distribution.cdf(statsToday.speed.max));
      avgProbToday = formatPercents(distribution.cdf(statsToday.speed.avg));
    }
  }

  return {
    today,
    resultsByDate,
    resultsToday,
    totalTime,
    totalLessons,
    topSpeed,
    avgSpeed,
    totalTimeToday,
    totalLessonsToday,
    topSpeedToday,
    avgSpeedToday,
    topProb,
    avgProb,
    topProbToday,
    avgProbToday,
  };
}

export function AllTimeSummary({
  summary: { totalTime, totalLessons, topSpeed, avgSpeed },
}: {
  readonly summary: Summary;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { speedUnit, speedUnitName } = useFormatter();

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
          value={totalTime}
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
          value={totalLessons}
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
          value={topSpeed}
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
          value={avgSpeed}
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
  summary: { totalTimeToday, totalLessonsToday, topSpeedToday, avgSpeedToday },
}: {
  readonly summary: Summary;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { speedUnit, speedUnitName } = useFormatter();

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
          value={totalTimeToday}
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
          value={totalLessonsToday}
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
          value={topSpeedToday}
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
          value={avgSpeedToday}
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
