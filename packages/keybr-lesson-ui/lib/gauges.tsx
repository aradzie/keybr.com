import { useIntlNumbers } from "@keybr/intl";
import { type SummaryStats } from "@keybr/result";
import { type ClassName, Name, Value } from "@keybr/widget";
import { clsx } from "clsx";
import { memo, type ReactNode } from "react";
import { useIntl } from "react-intl";
import { useFormatter } from "./format.ts";
import * as styles from "./gauges.module.less";
import { type Names } from "./names.ts";

export const GaugeList = memo(function GaugeRow({
  summaryStats,
  names,
}: {
  readonly summaryStats: SummaryStats;
  readonly names?: Names;
}): ReactNode {
  return (
    <div className={styles.gaugeList}>
      <SpeedGauge summaryStats={summaryStats} names={names} />
      <AccuracyGauge summaryStats={summaryStats} names={names} />
      <ScoreGauge summaryStats={summaryStats} names={names} />
    </div>
  );
});

export const SpeedGauge = memo(function SpeedGauge({
  summaryStats,
  names,
}: {
  readonly summaryStats: SummaryStats;
  readonly names?: Names;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatSpeed } = useFormatter();
  const { last, delta } = summaryStats.speed;
  return (
    <Gauge
      id={names?.speed}
      name={
        <Name
          name={formatMessage({
            id: "metric.speed.name",
            defaultMessage: "Speed",
          })}
        />
      }
      value={<Value value={formatSpeed(last)} />}
      delta={
        <Value
          value={signed(formatSpeed(delta), delta)}
          delta={delta}
          title={formatMessage({
            id: "metric.speedChange.description",
            defaultMessage: "The difference from the average value.",
          })}
        />
      }
      title={formatMessage({
        id: "metric.speed.description",
        defaultMessage: "Typing speed in the last lesson.",
      })}
    />
  );
});

export const AccuracyGauge = memo(function AccuracyGauge({
  summaryStats,
  names,
}: {
  readonly summaryStats: SummaryStats;
  readonly names?: Names;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatPercents } = useIntlNumbers();
  const { last, delta } = summaryStats.accuracy;
  return (
    <Gauge
      id={names?.accuracy}
      name={
        <Name
          name={formatMessage({
            id: "metric.accuracy.name",
            defaultMessage: "Accuracy",
          })}
        />
      }
      value={<Value value={formatPercents(last)} />}
      delta={
        <Value
          value={signed(formatPercents(delta), delta)}
          delta={delta}
          title={formatMessage({
            id: "metric.accuracyChange.description",
            defaultMessage: "The difference from the average value.",
          })}
        />
      }
      title={formatMessage({
        id: "metric.accuracy.description",
        defaultMessage:
          "The percentage of characters typed without errors in the last lesson.",
      })}
    />
  );
});

export const ScoreGauge = memo(function ScoreGauge({
  summaryStats,
  names,
}: {
  readonly summaryStats: SummaryStats;
  readonly names?: Names;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatNumber } = useIntlNumbers();
  const { last, delta } = summaryStats.score;
  return (
    <Gauge
      id={names?.score}
      name={
        <Name
          name={formatMessage({
            id: "metric.score.name",
            defaultMessage: "Score",
          })}
        />
      }
      value={<Value value={formatNumber(last, 0)} />}
      delta={
        <Value
          value={signed(formatNumber(delta, 0), delta)}
          delta={delta}
          title={formatMessage({
            id: "metric.scoreChange.description",
            defaultMessage: "The difference from the average value.",
          })}
        />
      }
      title={formatMessage({
        id: "metric.score.description",
        defaultMessage:
          "Score of the last lesson in abstract points. " +
          "Scores are greater when you type faster and with fewer errors.",
      })}
    />
  );
});

export const Gauge = memo(function Gauge({
  id,
  className,
  name,
  value,
  delta,
  title,
}: {
  readonly id?: string;
  readonly className?: ClassName;
  readonly name: ReactNode;
  readonly value: ReactNode;
  readonly delta: ReactNode;
  readonly title: string;
}): ReactNode {
  return (
    <span id={id} className={clsx(styles.gauge, className)} title={title}>
      {name} {value} ({delta})
    </span>
  );
});

function signed(value: any, delta: number): string {
  const s = String(value);
  if (delta > 0) {
    return `\u2191+${s}`;
  }
  if (delta < 0) {
    return `\u2193${s}`;
  }
  return s;
}
