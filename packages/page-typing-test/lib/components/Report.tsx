import {
  AccuracyHistogram,
  makeAccuracyDistribution,
  makeSpeedDistribution,
  SpeedHistogram,
} from "@keybr/chart";
import { useIntlNumbers } from "@keybr/intl";
import { Screen } from "@keybr/pages-shared";
import {
  Box,
  Button,
  Field,
  FieldList,
  formatDuration,
  Icon,
  Kbd,
  Name,
  NameValue,
  Para,
  Spacer,
  useHotkeys,
  Value,
} from "@keybr/widget";
import { mdiSkipNext } from "@mdi/js";
import { memo, type ReactNode } from "react";
import { type TestResult } from "../session/index.ts";
import { Replay } from "./Replay.tsx";
import * as styles from "./Report.module.less";

export const Report = memo(function Report({
  result,
  onNext,
}: {
  readonly result: TestResult;
  readonly onNext: () => void;
}) {
  const { formatNumber, formatPercents } = useIntlNumbers();

  useHotkeys(["Enter", onNext]);

  const { time, speed, length, errors, accuracy } = result.stats;

  const dSpeed = makeSpeedDistribution();
  const dAccuracy = makeAccuracyDistribution();
  const pSpeed = dSpeed.cdf(speed);
  const pAccuracy = dAccuracy.cdf(dAccuracy.scale(accuracy));

  return (
    <Screen>
      <Box alignItems="center" justifyContent="center">
        <Indicator
          name="Speed"
          value={<Metric value={`${formatNumber(speed / 5, 2)}`} unit="WPM" />}
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
      </Box>

      <Para align="center">
        <NameValue name="Characters" value={formatNumber(length)} />
        <NameValue name="Errors" value={formatNumber(errors)} />
        <NameValue
          name="Time"
          value={formatDuration(time, { showMillis: true })}
        />
      </Para>

      <Box alignItems="center" justifyContent="center">
        <SpeedHistogram
          distribution={dSpeed}
          thresholds={[{ label: "Speed", value: speed }]}
          width="45rem"
          height="15rem"
        />
      </Box>

      <Para align="center">
        <Name>
          Faster than <Value value={formatPercents(pSpeed)} /> of all other
          people.
        </Name>{" "}
        <Name>
          You are in the top <Value value={formatPercents(top(pSpeed))} />.
        </Name>
      </Para>

      <Box alignItems="center" justifyContent="center">
        <AccuracyHistogram
          distribution={dAccuracy}
          thresholds={[{ label: "Accuracy", value: accuracy }]}
          width="45rem"
          height="15rem"
        />
      </Box>

      <Para align="center">
        <Name>
          More accurate than <Value value={formatPercents(pAccuracy)} /> of all
          other people.
        </Name>{" "}
        <Name>
          You are in the top <Value value={formatPercents(top(pAccuracy))} />.
        </Name>
      </Para>

      <Replay events={result.events} />

      <Spacer size={3} />

      <FieldList>
        <Field.Filler />
        <Field>
          <Button
            label="Next test"
            icon={<Icon shape={mdiSkipNext} />}
            title="Try another test."
            onClick={onNext}
          />
        </Field>
        <Field.Filler />
      </FieldList>

      <Para align="center">
        Press <Kbd>Enter</Kbd> to start a new test.
      </Para>
    </Screen>
  );
});

function Indicator({
  name,
  value,
  title,
}: {
  readonly name: ReactNode;
  readonly value: ReactNode;
  readonly title: string;
}) {
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
  readonly value: ReactNode;
  readonly unit: ReactNode;
}) {
  return (
    <>
      <span className={styles.valueLabel}>{value}</span>
      <span className={styles.unitLabel}>{unit}</span>
    </>
  );
}

function Separator() {
  return <div className={styles.separator} />;
}

function top(value: number) {
  return Math.max(0, 1 - value); // Takes care of negative zero.
}
