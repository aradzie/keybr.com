import { type LearningRate } from "@keybr/chart";
import { useIntlNumbers } from "@keybr/intl";
import { type LessonKey } from "@keybr/lesson";
import { Para, Value } from "@keybr/widget";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import * as styles from "./LearningRateDescription.module.less";

export function LearningRateDescription({
  lessonKey,
  learningRate,
}: {
  readonly lessonKey: LessonKey;
  readonly learningRate: LearningRate | null;
}): ReactNode {
  const { formatNumber, formatPercents } = useIntlNumbers();
  if (lessonKey.bestConfidence === 1) {
    return (
      <Para className={clsx(styles.component, styles.alreadyUnlocked)}>
        <FormattedMessage
          id="learningRate.alreadyUnlocked"
          description="Message text."
          defaultMessage="This letter is already unlocked."
        />
      </Para>
    );
  }
  if (
    learningRate != null &&
    learningRate.remainingLessons > 0 &&
    learningRate.certainty > 0
  ) {
    const remainingLessons = formatNumber(learningRate.remainingLessons);
    const certainty = formatPercents(learningRate.certainty);
    return (
      <Para className={clsx(styles.component, styles.remainingLessons)}>
        <FormattedMessage
          id="learningRate.remainingLessons"
          description="Message text."
          defaultMessage={
            "Approximately {remainingLessons} lessons remaining to " +
            "unlock this letter ({certainty} certainty)."
          }
          values={{
            remainingLessons: <Value value={remainingLessons} />,
            certainty: <Value value={certainty} />,
          }}
        />
      </Para>
    );
  }
  return (
    <Para className={clsx(styles.component, styles.unknown)}>
      <FormattedMessage
        id="learningRate.unknown"
        description="Message text."
        defaultMessage="Need more data to compute the remaining lessons to unlock this letter."
      />
    </Para>
  );
}
