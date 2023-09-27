import { LearningRate, type LessonKey } from "@keybr/lesson";
import { timeToSpeed } from "@keybr/result";
import { type ClassName, Name, NameValue, Value } from "@keybr/widget";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { useFormatter } from "./format.ts";
import { messages } from "./intl.ts";
import * as styles from "./styles.module.less";

export const KeyDetails = ({
  className,
  lessonKey,
}: {
  readonly className?: ClassName;
  readonly lessonKey: LessonKey;
}): ReactNode => {
  const { formatMessage } = useIntl();
  const fmt = useFormatter();
  if (lessonKey.confidence != null) {
    const lr = LearningRate.from(lessonKey.samples);
    const { speedUnitName } = fmt;
    return (
      <span
        className={clsx(
          styles.keyDetails,
          styles.keyDetails_calibrated,
          className,
        )}
      >
        <NameValue
          name={<Name name={formatMessage(messages.bestSpeedLabel)} />}
          value={<Value value={fmt(timeToSpeed(lessonKey.bestTimeToType))} />}
          title={formatMessage(messages.bestSpeedTitle, { speedUnitName })}
        />
        <NameValue
          name={<Name name={formatMessage(messages.confidenceLevelLabel)} />}
          value={<Value value={fmt.confidence(lessonKey.confidence)} />}
          title={formatMessage(messages.confidenceLevelTitle)}
        />
        <NameValue
          name={<Name name={formatMessage(messages.learningRateLabel)} />}
          value={<Value value={fmt.learningRate(lr)} />}
          title={formatMessage(messages.learningRateTitle)}
        />
      </span>
    );
  } else {
    return (
      <span
        className={clsx(
          styles.keyDetails,
          styles.keyDetails_uncalibrated,
          className,
        )}
      >
        {formatMessage(messages.notCalibratedText)}
      </span>
    );
  }
};
