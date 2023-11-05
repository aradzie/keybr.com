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
  const { formatSpeed } = useFormatter();

  const {
    stats: { count, time, speed },
  } = summary;

  return (
    <>
      <Header level={2}>
        <FormattedMessage
          id="profile.overview.statisticsAllTime"
          description="Header text."
          defaultMessage="All Time Statistics"
        />
      </Header>

      <Para className={styles.statisticList}>
        <Statistic
          name={formatMessage({
            id: "profile.overview.totalTime.label",
            description: "Widget name.",
            defaultMessage: "Total Time",
          })}
          value={formatDuration(time)}
          title={formatMessage({
            id: "profile.overview.totalTime.description",
            description: "Widget description.",
            defaultMessage: "Time spent on exercises.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "profile.overview.totalLessons.label",
            description: "Widget name.",
            defaultMessage: "Total Lessons",
          })}
          value={formatNumber(count)}
          title={formatMessage({
            id: "profile.overview.totalLessons.description",
            description: "Widget description.",
            defaultMessage: "The number of lessons completed.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "profile.overview.topSpeed.label",
            description: "Widget name.",
            defaultMessage: "Top Speed",
          })}
          value={speed.max > 0 ? formatSpeed(speed.max) : "N/A"}
          title={formatMessage({
            id: "profile.overview.topSpeed.description",
            description: "Widget description.",
            defaultMessage: "Top typing speed.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "profile.overview.averageSpeed.label",
            description: "Widget name.",
            defaultMessage: "Average Speed",
          })}
          value={speed.avg > 0 ? formatSpeed(speed.avg) : "N/A"}
          title={formatMessage({
            id: "profile.overview.averageSpeed.description",
            description: "Widget description.",
            defaultMessage: "Average typing speed.",
          })}
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
  const { formatSpeed } = useFormatter();

  const {
    statsToday: { count, time, speed },
  } = summary;

  return (
    <>
      <Header level={2}>
        <FormattedMessage
          id="profile.overview.statisticsToday"
          description="Header text."
          defaultMessage="Statistics for Today"
        />
      </Header>

      <Para className={styles.statisticList}>
        <Statistic
          name={formatMessage({
            id: "profile.overview.totalTimeToday.label",
            description: "Widget name.",
            defaultMessage: "Total Time",
          })}
          value={formatDuration(time)}
          title={formatMessage({
            id: "profile.overview.totalTimeToday.description",
            description: "Widget description.",
            defaultMessage: "Time spent on exercises today.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "profile.overview.totalLessonsToday.label",
            description: "Widget name.",
            defaultMessage: "Total Lessons",
          })}
          value={formatNumber(count)}
          title={formatMessage({
            id: "profile.overview.totalLessonsToday.description",
            description: "Widget description.",
            defaultMessage: "The number of lessons completed today.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "profile.overview.topSpeedToday.label",
            description: "Widget name.",
            defaultMessage: "Top Speed",
          })}
          value={speed.max > 0 ? formatSpeed(speed.max) : "N/A"}
          title={formatMessage({
            id: "profile.overview.topSpeedToday.description",
            description: "Widget description.",
            defaultMessage: "Top typing speed today.",
          })}
        />

        <Statistic
          name={formatMessage({
            id: "profile.overview.averageSpeedToday.label",
            description: "Widget name.",
            defaultMessage: "Average Speed",
          })}
          value={speed.avg > 0 ? formatSpeed(speed.avg) : "N/A"}
          title={formatMessage({
            id: "profile.overview.averageSpeedToday.description",
            description: "Widget description.",
            defaultMessage: "Average typing speed today.",
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
