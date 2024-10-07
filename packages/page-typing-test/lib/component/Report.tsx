import {
  AccuracyHistogram,
  makeAccuracyDistribution,
  makeSpeedDistribution,
  SpeedHistogram,
} from "@keybr/chart";
import { useIntlNumbers } from "@keybr/intl";
import { type Stats } from "@keybr/textinput";
import {
  Button,
  Field,
  FieldList,
  formatDuration,
  Icon,
  Name,
  NameValue,
  Value,
} from "@keybr/widget";
import { mdiFileImage, mdiSkipNext } from "@mdi/js";
import { captureElementToImage } from "@sosimple/dom-to-image";
import { memo, type ReactNode } from "react";
import * as styles from "./Report.module.less";

export const Report = memo(function Report({
  stats: { time, speed, length, errors, accuracy },
  onNext,
}: {
  readonly stats: Stats;
  readonly onNext: () => void;
}): ReactNode {
  const { formatNumber, formatPercents } = useIntlNumbers();
  const dSpeed = makeSpeedDistribution();
  const dAccuracy = makeAccuracyDistribution();
  const pSpeed = dSpeed.cdf(speed);
  const pAccuracy = dAccuracy.cdf(dAccuracy.scale(accuracy));

  const handleClickNext = () => {
    onNext();
  };

  const handleClickScreenshot = () => {
    const selector = `.${styles.printable}`;
    const { backgroundColor } = getComputedStyle(document.body);
    captureElementToImage(selector, { backgroundColor })
      .then((blob) => {
        window.open(URL.createObjectURL(blob), "_blank");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className={styles.report}>
      <div className={styles.printable}>
        <div className={styles.indicatorsLine}>
          <Indicator
            name="Speed"
            value={
              <Metric value={`${formatNumber(speed / 5, 2)}`} unit="WPM" />
            }
            title="The typing speed in words per minute."
          />
          <Separator />
          <Indicator
            name="Accuracy"
            value={
              <Metric value={`${formatNumber(accuracy * 100, 2)}`} unit="%" />
            }
            title="The percentage of characters typed without errors."
          />
        </div>

        <div className={styles.secondaryLine}>
          <NameValue name="Characters" value={formatNumber(length)} />
          <NameValue name="Errors" value={formatNumber(errors)} />
          <NameValue
            name="Time"
            value={formatDuration(time, { showMillis: true })}
          />
        </div>

        <div className={styles.secondaryLine}>
          <SpeedHistogram
            distribution={dSpeed}
            thresholds={[{ label: "Speed", value: speed }]}
            width="100%"
            height="15rem"
          />
        </div>

        <div className={styles.secondaryLine}>
          <Name>
            Faster than <Value value={formatPercents(pSpeed)} /> of all other
            people.
          </Name>{" "}
          <Name>
            You are in the top <Value value={formatPercents(top(pSpeed))} />.
          </Name>
        </div>

        <div className={styles.secondaryLine}>
          <AccuracyHistogram
            distribution={dAccuracy}
            thresholds={[{ label: "Accuracy", value: accuracy }]}
            width="100%"
            height="15rem"
          />
        </div>

        <div className={styles.secondaryLine}>
          <Name>
            More accurate than <Value value={formatPercents(pAccuracy)} /> of
            all other people.
          </Name>{" "}
          <Name>
            You are in the top <Value value={formatPercents(top(pAccuracy))} />.
          </Name>
        </div>
      </div>

      <div className={styles.controlsLine}>
        <FieldList>
          <Field>
            <Button
              label="Next test"
              icon={<Icon shape={mdiSkipNext} />}
              title="Try another test."
              onClick={handleClickNext}
            />
          </Field>
          <Field>
            <Button
              label="Screenshot"
              icon={<Icon shape={mdiFileImage} />}
              title="Take a screenshot."
              onClick={handleClickScreenshot}
            />
          </Field>
        </FieldList>
      </div>
    </div>
  );
});

function Indicator({
  name,
  value,
  title,
}: {
  readonly name: string | ReactNode;
  readonly value: string | ReactNode;
  readonly title: string;
}): ReactNode {
  return (
    <div className={styles.indicator} title={title}>
      <div className={styles.indicatorValue}>
        <Value>{value}</Value>
      </div>
      <div className={styles.indicatorName}>
        <Name>{name}</Name>
      </div>
    </div>
  );
}

function Metric({
  value,
  unit,
}: {
  readonly value: string;
  readonly unit: string;
}): ReactNode {
  return (
    <>
      <span className={styles.valueLabel}>{value}</span>
      <span className={styles.unitLabel}>{unit}</span>
    </>
  );
}

function Separator(): ReactNode {
  return <div className={styles.separator} />;
}

function top(value: number): number {
  return Math.max(0, 1 - value); // Takes care of negative zero.
}
