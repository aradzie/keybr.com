import { useIntlNumbers } from "@keybr/intl";
import { type ClassName, Value } from "@keybr/widget";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import * as styles from "./DailyGoal.module.less";

const Label = ({
  value,
  goal,
}: {
  readonly value: number;
  readonly goal: number;
}): ReactNode => {
  const { formatNumber, formatPercents } = useIntlNumbers();
  return (
    <Value
      value={`${formatPercents(value, 0)}/${formatNumber(goal)} minutes`}
    />
  );
};

const Gauge = ({ value }: { readonly value: number }): ReactNode => {
  value = Math.max(0, value);
  const barWidth = value > 1 ? 100 : Math.round(value * 100);
  const frameWidth = value > 1 ? Math.round((1 / value) * 100) : 100;
  return (
    <div className={styles.gauge}>
      <div className={styles.bar} style={{ width: `${barWidth}%` }} />
      <div className={styles.frame} style={{ width: `${frameWidth}%` }} />
    </div>
  );
};

export const DailyGoal = ({
  id,
  className,
  value,
  goal,
}: {
  readonly id?: string;
  readonly className?: ClassName;
  readonly value: number;
  readonly goal: number;
}): ReactNode => {
  return (
    <span id={id} className={clsx(styles.dailyGoal, className)}>
      <Label value={value} goal={goal} />
      <Gauge value={value} />
    </span>
  );
};
