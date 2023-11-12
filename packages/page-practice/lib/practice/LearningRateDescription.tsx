import { useIntlNumbers } from "@keybr/intl";
import { type LearningRate, type LessonKey } from "@keybr/lesson";
import { Name, Para, styleTextCenter, Value } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function LearningRateDescription({
  lessonKey,
  learningRate,
}: {
  readonly lessonKey: LessonKey;
  readonly learningRate: LearningRate | null;
}): ReactNode {
  const { formatNumber, formatPercents } = useIntlNumbers();
  if ((lessonKey.bestConfidence ?? 0) >= 1) {
    return (
      <Para className={styleTextCenter}>
        <Name>
          <FormattedMessage
            id="learningRate.alreadyUnlocked"
            description="Message text."
            defaultMessage="This letter is already unlocked."
          />
        </Name>
      </Para>
    );
  }
  if (
    learningRate != null &&
    learningRate.remainingLessons > 0 &&
    learningRate.certainty > 0
  ) {
    return (
      <Para className={styleTextCenter}>
        <Name>
          <FormattedMessage
            id="learningRate.remainingLessons"
            description="Message text."
            defaultMessage={
              "Approximately {remainingLessons} lessons remaining to " +
              "unlock this letter ({certainty} certainty)."
            }
            values={{
              remainingLessons: (
                <Value value={formatNumber(learningRate.remainingLessons)} />
              ),
              certainty: (
                <Value value={formatPercents(learningRate.certainty)} />
              ),
            }}
          />
        </Name>
      </Para>
    );
  }
  return (
    <Para className={styleTextCenter}>
      <Name>
        <FormattedMessage
          id="learningRate.unknown"
          description="Message text."
          defaultMessage="Need more data to compute the remaining lessons to unlock this letter."
        />
      </Name>
    </Para>
  );
}
