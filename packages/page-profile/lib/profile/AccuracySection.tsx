import { useIntlNumbers } from "@keybr/intl";
import { useFormatter } from "@keybr/lesson-ui";
import {
  makeSummaryStats,
  MutableStreakList,
  type Streak,
} from "@keybr/result";
import {
  Explainer,
  Figure,
  NameValue,
  Para,
  styleTextCenter,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { type ResultSummary } from "./resultsummary.ts";

export function AccuracySection({
  summary,
}: {
  readonly summary: ResultSummary;
}): ReactNode {
  const streaks = MutableStreakList.findLongest(summary.allTimeStats.results);

  return (
    <Figure>
      <Figure.Caption>
        <FormattedMessage
          id="profile.accuracy.header"
          defaultMessage="Accuracy Streaks"
        />
      </Figure.Caption>

      {streaks.length > 0 ? (
        <dl>
          {streaks.map((streak, index) => (
            <StreakDetails key={index} streak={streak} />
          ))}
        </dl>
      ) : (
        <Para className={styleTextCenter}>
          <FormattedMessage
            id="profile.accuracy.noData"
            defaultMessage="You don’t have any accuracy streaks. Consider completing a lesson with a highest accuracy possible, regardless of typing speed."
          />
        </Para>
      )}

      <Explainer>
        <Figure.Description>
          <FormattedMessage
            id="profile.accuracy.legend"
            defaultMessage="Above are listed the longest continuous sequences of lessons with accuracy above a given threshold, along with statistics about every such sequence. The longer the sequence of lessons, the better."
          />
        </Figure.Description>
      </Explainer>
    </Figure>
  );
}

function StreakDetails({ streak }: { readonly streak: Streak }): ReactNode {
  const { formatMessage, formatDate } = useIntl();
  const { formatNumber, formatPercents } = useIntlNumbers();
  const { formatSpeed } = useFormatter();
  const { level, results } = streak;
  const characterCount = results.reduce((x, { length }) => length + x, 0);
  const stats = makeSummaryStats(results);

  return (
    <>
      <dt>
        <NameValue
          name={formatMessage({
            id: "profile.chart.accuracy.accuracyThreshold.header",
            defaultMessage: "Accuracy Threshold",
          })}
          value={formatPercents(level)}
        />
      </dt>
      <dd>
        <NameValue
          name={formatMessage({
            id: "metric.summary.lessonCount.label",
            defaultMessage: "Lessons",
          })}
          value={formatNumber(results.length)}
        />
        <NameValue
          name={formatMessage({
            id: "metric.summary.characterCount.label",
            defaultMessage: "Characters",
          })}
          value={formatNumber(characterCount)}
        />
        <NameValue
          name={formatMessage({
            id: "metric.summary.topSpeed.label",
            defaultMessage: "Top Speed",
          })}
          value={formatSpeed(stats.speed.max)}
        />
        <NameValue
          name={formatMessage({
            id: "metric.summary.averageSpeed.label",
            defaultMessage: "Average Speed",
          })}
          value={formatSpeed(stats.speed.avg)}
        />
        <NameValue
          name={formatMessage({
            id: "metric.summary.startDate.label",
            defaultMessage: "Start Date",
          })}
          value={formatDate(results[0].timeStamp, {
            dateStyle: "short",
            timeStyle: "short",
          })}
        />
      </dd>
    </>
  );
}
