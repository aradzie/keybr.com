import { useIntlDurations, useIntlNumbers } from "@keybr/intl";
import { type DailyGoal as DailyGoalType } from "@keybr/lesson";
import { type ClassName, Value } from "@keybr/widget";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import * as styles from "./DailyGoal.module.less";

export const DailyGoal = ({
  id,
  className,
  dailyGoal,
}: {
  readonly id?: string;
  readonly className?: ClassName;
  readonly dailyGoal: DailyGoalType;
}): ReactNode => {
  return (
    <span id={id} className={clsx(styles.root, className)}>
      <DailyGoalLabel value={dailyGoal.value} goal={dailyGoal.goal} />
      <DailyGoalGauge value={dailyGoal.value} />
    </span>
  );
};

const DailyGoalLabel = ({
  value,
  goal,
}: {
  readonly value: number;
  readonly goal: number;
}): ReactNode => {
  const { formatPercents } = useIntlNumbers();
  const { formatDuration } = useIntlDurations();
  return (
    <Value
      value={`${formatPercents(value, 0)}/${formatDuration({ minutes: goal })}`}
    />
  );
};

const DailyGoalGauge = ({ value }: { readonly value: number }): ReactNode => {
  value = Math.max(0, value);
  const barWidth = value > 1 ? 100 : Math.round(value * 100);
  const frameWidth = value > 1 ? Math.round((1 / value) * 100) : 100;
  return (
    <div className={styles.gauge}>
      <div className={styles.bar} style={{ inlineSize: `${barWidth}%` }} />
      <div className={styles.frame} style={{ inlineSize: `${frameWidth}%` }} />
    </div>
  );
};
