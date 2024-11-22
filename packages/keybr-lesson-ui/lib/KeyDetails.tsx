import { LearningRate, type LessonKey, Target } from "@keybr/lesson";
import { timeToSpeed } from "@keybr/result";
import { useSettings } from "@keybr/settings";
import { Name, NameValue, Value } from "@keybr/widget";
import { clsx } from "clsx";
import { useIntl } from "react-intl";
import { useFormatter } from "./format.ts";
import { Happiness } from "./Happiness.tsx";
import { messages } from "./intl.ts";
import * as styles from "./styles.module.less";

export const KeyDetails = ({ lessonKey }: { lessonKey: LessonKey }) => {
  const { formatMessage } = useIntl();
  const { formatSpeed, formatConfidence, formatLearningRate, speedUnitName } =
    useFormatter();
  const { settings } = useSettings();
  const { timeToType, bestTimeToType, confidence, bestConfidence } = lessonKey;
  if (
    timeToType != null &&
    bestTimeToType != null &&
    confidence != null &&
    bestConfidence != null
  ) {
    const learningRate =
      LearningRate.from(
        lessonKey.samples, //
        new Target(settings),
      )?.learningRate ?? null;
    return (
      <span className={clsx(styles.keyDetails, styles.keyDetails_calibrated)}>
        <NameValue
          name={<Name name={formatMessage(messages.lastSpeedName)} />}
          value={
            <Value>
              {`${formatSpeed(timeToSpeed(timeToType))}`}
              {` (${formatConfidence(confidence)})`}
            </Value>
          }
          title={formatMessage(messages.lastSpeedDescription, {
            speedUnitName,
          })}
        />
        <NameValue
          name={<Name name={formatMessage(messages.topSpeedName)} />}
          value={
            <Value>
              {`${formatSpeed(timeToSpeed(bestTimeToType))}`}
              {` (${formatConfidence(bestConfidence)})`}
            </Value>
          }
          title={formatMessage(messages.topSpeedDescription, {
            speedUnitName,
          })}
        />
        <NameValue
          name={<Name name={formatMessage(messages.learningRateName)} />}
          value={
            <Value
              value={
                <>
                  {formatLearningRate(learningRate)}
                  {"\u00A0"}
                  <Happiness learningRate={learningRate ?? 0} />
                </>
              }
              delta={learningRate ?? 0}
            />
          }
          title={formatMessage(messages.learningRateDescription)}
        />
      </span>
    );
  } else {
    return (
      <span className={clsx(styles.keyDetails, styles.keyDetails_uncalibrated)}>
        {formatMessage(messages.notCalibratedText)}
      </span>
    );
  }
};
