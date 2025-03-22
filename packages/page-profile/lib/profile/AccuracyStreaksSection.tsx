import { useIntlNumbers } from "@keybr/intl";
import { useFormatter } from "@keybr/lesson-ui";
import {
  makeSummaryStats,
  MutableStreakList,
  type Result,
  type Streak,
} from "@keybr/result";
import { Explainer, Figure, NameValue, Para } from "@keybr/widget";
import { FormattedMessage, useIntl } from "react-intl";

export function AccuracyStreaksSection({
  results,
}: {
  results: readonly Result[];
}) {
  const streaks = MutableStreakList.findLongest(results);

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
        <Para align="center">
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

function StreakDetails({ streak }: { streak: Streak }) {
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
            id: "t_Accuracy_threshold",
            defaultMessage: "Accuracy threshold",
          })}
          value={formatPercents(level)}
        />
      </dt>
      <dd>
        <NameValue
          name={formatMessage({
            id: "t_num_Lessons",
            defaultMessage: "Lessons",
          })}
          value={formatNumber(results.length)}
        />
        <NameValue
          name={formatMessage({
            id: "t_num_Characters",
            defaultMessage: "Characters",
          })}
          value={formatNumber(characterCount)}
        />
        <NameValue
          name={formatMessage({
            id: "t_Top_speed",
            defaultMessage: "Top speed",
          })}
          value={formatSpeed(stats.speed.max)}
        />
        <NameValue
          name={formatMessage({
            id: "t_Average_speed",
            defaultMessage: "Average speed",
          })}
          value={formatSpeed(stats.speed.avg)}
        />
        <NameValue
          name={formatMessage({
            id: "t_Start_date",
            defaultMessage: "Start date",
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
