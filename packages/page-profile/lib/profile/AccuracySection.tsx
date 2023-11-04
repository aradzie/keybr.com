import { useIntlNumbers } from "@keybr/intl";
import { useFormatter } from "@keybr/lesson-ui";
import { newSummaryStats, type Result } from "@keybr/result";
import {
  Figure,
  Header,
  NameValue,
  Para,
  styleTextCenter,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { type AccuracyStreak, accuracyStreaks } from "./accuracy.ts";

export function AccuracySection({
  results,
}: {
  readonly results: readonly Result[];
}): ReactNode {
  const streaks = accuracyStreaks(results);

  return (
    <>
      <Header level={2}>Accuracy Streaks</Header>

      <Figure>
        <Figure.Description>
          These stats show your ability to type long sequences of text with high
          accuracy, regardless of typing speed.
        </Figure.Description>

        {streaks.length > 0 ? (
          <dl>
            {streaks.map((streak, index) => (
              <StreakDetails key={index} streak={streak} />
            ))}
          </dl>
        ) : (
          <Para className={styleTextCenter}>
            You don’t have any accuracy streaks. Consider completing a lesson
            with a highest accuracy possible, regardless of typing speed.
          </Para>
        )}

        <Figure.Legend>
          Above are listed the longest continuous sequences of lessons with
          accuracy above a given threshold, along with statistics about every
          such sequence. The longer the sequence of lessons, the better.
        </Figure.Legend>
      </Figure>
    </>
  );
}

function StreakDetails({
  streak,
}: {
  readonly streak: AccuracyStreak;
}): ReactNode {
  const { formatMessage, formatDate } = useIntl();
  const { formatNumber, formatPercents } = useIntlNumbers();
  const { formatSpeed } = useFormatter();
  const { results } = streak;
  const stats = newSummaryStats(results);

  return (
    <>
      <dt>
        <NameValue
          name={formatMessage({
            id: "profile.accuracyThreshold.label",
            description: "Widget name.",
            defaultMessage: "Accuracy Threshold",
          })}
          value={formatPercents(streak.threshold)}
        />
      </dt>
      <dd>
        <NameValue
          name={formatMessage({
            id: "metric.summary.lessonCount.label",
            description: "Widget name.",
            defaultMessage: "Lessons",
          })}
          value={formatNumber(results.length)}
        />
        <NameValue
          name={formatMessage({
            id: "metric.summary.characterCount.label",
            description: "Widget name.",
            defaultMessage: "Characters",
          })}
          value={formatNumber(streak.length)}
        />
        <NameValue
          name={formatMessage({
            id: "metric.summary.topSpeed.label",
            description: "Widget name.",
            defaultMessage: "Top Speed",
          })}
          value={formatSpeed(stats.speed.max)}
        />
        <NameValue
          name={formatMessage({
            id: "metric.summary.averageSpeed.label",
            description: "Widget name.",
            defaultMessage: "Average Speed",
          })}
          value={formatSpeed(stats.speed.avg)}
        />
        <NameValue
          name="Start date"
          value={formatDate(results[0].timeStamp, {
            dateStyle: "short",
            timeStyle: "short",
          })}
        />
      </dd>
    </>
  );
}
