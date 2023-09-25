import { useIntlNumbers } from "@keybr/intl";
import { type Stats } from "@keybr/textinput";
import { Button, Field, FieldList, formatDuration, Icon } from "@keybr/widget";
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
  const { formatNumber } = useIntlNumbers();

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
            value={<Value value={`${formatNumber(speed / 5, 2)}`} unit="WPM" />}
            title="Typing speed in words per minute."
          />
          <Separator />
          <Indicator
            name="Speed"
            value={<Value value={`${formatNumber(speed, 1)}`} unit="CPM" />}
            title="Typing speed in characters per minute."
          />
          <Separator />
          <Indicator
            name="Accuracy"
            value={
              <Value value={`${formatNumber(accuracy * 100, 2)}`} unit="%" />
            }
            title="The percentage of characters typed without errors."
          />
        </div>

        <p className={styles.secondaryLine}>
          Character count: <strong>{formatNumber(length)}</strong>
          {" | "}
          Error count: <strong>{formatNumber(errors)}</strong>
          {" | "}
          Time taken:{" "}
          <strong>{formatDuration(time, { showMillis: true })}</strong>
        </p>
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
  readonly name: string;
  value: string | ReactNode;
  title: string;
}): ReactNode {
  return (
    <div className={styles.indicator} title={title}>
      <div className={styles.indicatorValue}>{value}</div>
      <div className={styles.indicatorName}>{name}</div>
    </div>
  );
}

function Value({
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
