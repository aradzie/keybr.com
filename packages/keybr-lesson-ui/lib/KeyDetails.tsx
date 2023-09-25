import { useIntlNumbers } from "@keybr/intl";
import { type LessonKey } from "@keybr/lesson";
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
  lessonKey: { timeToType, bestTimeToType, confidence },
}: {
  readonly className?: ClassName;
  readonly lessonKey: LessonKey;
}): ReactNode => {
  const { formatMessage } = useIntl();
  const { formatNumber } = useIntlNumbers();
  const fmt = useFormatter();
  if (confidence != null) {
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
          name={<Name name={formatMessage(messages.averageSpeedLabel)} />}
          value={<Value value={fmt(timeToSpeed(timeToType))} />}
          title={formatMessage(messages.averageSpeedTitle, { speedUnitName })}
        />
        <NameValue
          name={<Name name={formatMessage(messages.bestSpeedLabel)} />}
          value={<Value value={fmt(timeToSpeed(bestTimeToType))} />}
          title={formatMessage(messages.bestSpeedTitle, { speedUnitName })}
        />
        <NameValue
          name={<Name name={formatMessage(messages.confidenceLevelLabel)} />}
          value={<Value value={formatNumber(confidence, 2)} />}
          title={formatMessage(messages.confidenceLevelTitle)}
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
