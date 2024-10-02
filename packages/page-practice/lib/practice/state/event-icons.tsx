import { type ClassName } from "@keybr/widget";
import { mdiAlarmCheck, mdiTrophy } from "@mdi/js";
import { clsx } from "clsx";
import * as styles from "./event-icons.module.less";

export function TrophyIcon() {
  return <Icon shape={mdiTrophy} className={styles.trophy} />;
}

export function DailyGoalIcon() {
  return <Icon shape={mdiAlarmCheck} />;
}

function Icon({
  shape,
  className,
}: {
  readonly shape: string;
  readonly className?: ClassName;
}) {
  return (
    <svg className={clsx(styles.icon, className)} viewBox="0 0 24 24">
      <path d={shape} />
    </svg>
  );
}
