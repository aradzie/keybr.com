import { useIntlNumbers } from "@keybr/intl";
import { type LessonKeys } from "@keybr/lesson";
import { type SummaryStats } from "@keybr/result";
import { type ClassName, Name, Value } from "@keybr/widget";
import { clsx } from "clsx";
import { memo, type ReactNode } from "react";
import { useIntl } from "react-intl";
import { CurrentKey } from "./CurrentKey.tsx";
import { DailyGoal } from "./DailyGoal.tsx";
import { useFormatter } from "./format.ts";
import * as styles from "./Indicators.module.less";
import { KeySet } from "./KeySet.tsx";

export type Names = {
  readonly speed?: string;
  readonly accuracy?: string;
  readonly score?: string;
  readonly keySet?: string;
  readonly currentKey?: string;
  readonly dailyGoal?: string;
};

export const GaugeRow = memo(function GaugeRow({
  summaryStats,
  names,
}: {
  readonly summaryStats: SummaryStats;
  readonly names?: Names;
}): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <div className={styles.row}>
      <Name
        className={styles.name}
        name={formatMessage({
          id: "lesson.gaugesPanelLabel",
          description: "Panel label.",
          defaultMessage: "Metrics",
        })}
      />
      <div className={styles.gaugeList}>
        <SpeedGauge summaryStats={summaryStats} names={names} />
        <AccuracyGauge summaryStats={summaryStats} names={names} />
        <ScoreGauge summaryStats={summaryStats} names={names} />
      </div>
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
  const fmt = useFormatter();
  const { last, delta } = summaryStats.speed;
  return (
    <Gauge
      id={names?.speed}
      name={
        <Name
          name={formatMessage({
            id: "metric.speed.label",
            description: "Label text.",
            defaultMessage: "Speed",
          })}
        />
      }
      value={<Value value={fmt(last)} />}
      delta={
        <Value
          value={signed(fmt(delta), delta)}
          delta={delta}
          title={formatMessage({
            id: "metric.speedChange.title",
            description: "Value change title.",
            defaultMessage: "The difference from the average value.",
          })}
        />
      }
      title={formatMessage({
        id: "metric.speed.title",
        description: "Value title.",
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
            id: "metric.accuracy.label",
            description: "Label text.",
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
            id: "metric.accuracyChange.title",
            description: "Value change title.",
            defaultMessage: "The difference from the average value.",
          })}
        />
      }
      title={formatMessage({
        id: "metric.accuracy.title",
        description: "Value title.",
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
            id: "metric.score.label",
            description: "Label text.",
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
            id: "metric.scoreChange.title",
            description: "Value change title.",
            defaultMessage: "The difference from the average value.",
          })}
        />
      }
      title={formatMessage({
        id: "metric.score.title",
        description: "Value title.",
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

export const KeySetRow = memo(function KeySetRow({
  lessonKeys,
  names,
}: {
  readonly lessonKeys: LessonKeys;
  readonly names?: Names;
}): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <div className={styles.row}>
      <Name
        className={styles.name}
        name={formatMessage({
          id: "lesson.keySetPanelLabel",
          description: "Panel label.",
          defaultMessage: "All keys",
        })}
      />
      <KeySet
        id={names?.keySet}
        className={styles.value}
        lessonKeys={lessonKeys}
      />
    </div>
  );
});

export const CurrentKeyRow = memo(function CurrentKeyRow({
  lessonKeys,
  names,
}: {
  readonly lessonKeys: LessonKeys;
  readonly names?: Names;
}): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <div className={styles.row}>
      <Name
        className={styles.name}
        name={formatMessage({
          id: "lesson.currentKeyPanelLabel",
          description: "Panel label.",
          defaultMessage: "Current key",
        })}
      />
      <CurrentKey
        id={names?.currentKey}
        className={styles.value}
        lessonKeys={lessonKeys}
      />
    </div>
  );
});

export const DailyGoalRow = memo(function DailyGoalRow({
  value,
  goal,
  names,
}: {
  readonly value: number;
  readonly goal: number;
  readonly names?: Names;
}): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <div
      className={styles.row}
      title={formatMessage({
        id: "lesson.dailyGoalPanelTitle",
        description: "Panel title.",
        defaultMessage: "The progress to your daily goal.",
      })}
    >
      <Name
        className={styles.name}
        name={formatMessage({
          id: "lesson.dailyGoalPanelLabel",
          description: "Panel label.",
          defaultMessage: "Daily goal",
        })}
      />
      <DailyGoal
        id={names?.dailyGoal}
        className={styles.value}
        value={value}
        goal={goal}
      />
    </div>
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
